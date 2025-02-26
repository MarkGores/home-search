require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Helper to convert a value to an integer (using floor)
const intify = (value) => {
  if (value == null || value === '') return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  return Math.floor(num);
};

// Helper to truncate strings to a given maximum length, with logging
const fixVarchar10 = (value, maxLength = 10) => {
  if (typeof value !== 'string') return value;
  if (value.length > maxLength) {
    console.warn(`Value "${value}" exceeds max length ${maxLength}, truncating to "${value.substring(0, maxLength)}".`);
    return value.substring(0, maxLength);
  }
  return value;
};

async function ingestListings() {
  // Create a connection pool using environment variables
  const pool = new Pool({
    host: process.env.PGHOST || 'database-1.c7s6ewq8sbmg.us-east-2.rds.amazonaws.com',
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'YOUR_PASSWORD_HERE',
    database: process.env.PGDATABASE || 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Load the MLS JSON file (adjust the file path as needed)
    const filePath = path.join(__dirname, 'data', 'mls_listings.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const listings = JSON.parse(data);
    console.log(`Processing ${listings.length} listings`);

    for (const listing of listings) {
      // Convert numeric fields using intify
      const streetNumberInt = intify(listing.StreetNumber || (listing.raw_data && listing.raw_data.StreetNumber) || null);
      const livingAreaInt = intify(listing.LivingArea);
      const lotSizeSquareFeetInt = intify(listing.LotSizeSquareFeet);
      const bedroomsTotalInt = intify(listing.BedroomsTotal);
      const bathroomsTotalIntegerInt = intify(listing.BathroomsTotalInteger);
      const daysOnMarketInt = intify(listing.DaysOnMarket);
      const yearBuiltInt = intify(listing.YearBuilt);
      const documentsCountInt = intify(listing.DocumentsCount);
      const foundationAreaInt = intify(listing.FoundationArea);
      const garageSpacesInt = intify(listing.GarageSpaces);
      const photosCountInt = intify(listing.PhotosCount);
      const aboveGradeFinishedAreaInt = intify(listing.AboveGradeFinishedArea);
      const belowGradeFinishedAreaInt = intify(listing.BelowGradeFinishedArea);

      // Fallback for values from top-level or raw_data if missing
      const streetSuffix = listing.StreetSuffix || (listing.raw_data && listing.raw_data.StreetSuffix) || null;
      const countyOrParish = listing.CountyOrParish || (listing.raw_data && listing.raw_data.CountyOrParish) || null;
      const postalCode = listing.PostalCode || (listing.raw_data && listing.raw_data.PostalCode) || null;
      const stateOrProvince = listing.StateOrProvince || (listing.raw_data && listing.raw_data.StateOrProvince) || null;

      // For fields that require VARCHAR(50), use fixVarchar10 with maxLength 50
      const NST_AgentOwner = fixVarchar10(listing.NST_AgentOwner, 50);
      const NST_AssessmentPending = fixVarchar10(listing.NST_AssessmentPending, 50);
      const NST_RentalLicenseYN = fixVarchar10(listing.NST_RentalLicenseYN, 50);
      const NST_FractionalOwnershipYN = fixVarchar10(listing.NST_FractionalOwnershipYN, 50);
      const NST_ManufacturedHome = fixVarchar10(listing.NST_ManufacturedHome, 50);
      const NST_LakeChain = fixVarchar10(listing.NST_LakeChain, 50);
      const NST_PotentialShortSale = fixVarchar10(listing.NST_PotentialShortSale, 50);

      const query = `
        INSERT INTO listings (
          "ListingKey", "ListingId", "ListPrice", "BedroomsTotal", "BathroomsTotalInteger",
          "City", "StreetName", "StreetNumber", "StreetSuffix", "CountyOrParish",
          "PostalCode", "StateOrProvince", "LivingArea", "LotSizeArea", "LotSizeSquareFeet",
          "WaterfrontYN", "DaysOnMarket", "YearBuilt", "StandardStatus", "PropertyType",
          "PropertySubType", "NST_AmenitiesUnit", "Appliances", "NST_AgentOwner", "AssociationYN",
          "AssociationFee", "NST_AssessmentPending", "NST_BathDesc", "NST_DiningRoomDescription",
          "Directions", "DocumentsCount", "DocumentsChangeTimestamp", "Electric", "ConstructionMaterials",
          "Fencing", "FireplaceYN", "FireplacesTotal", "NST_ForeclosureStatus", "FoundationArea",
          "NST_FractionalOwnershipYN", "RoadFrontageType", "NST_Fuel", "ParkingFeatures",
          "NST_GarageSquareFeet", "AccessibilityFeatures", "Heating", "OriginalEntryTimestamp",
          "NST_InternetOptions", "NST_LakeAcres", "NST_LakeChain", "NST_LakeDepth", "WaterfrontFeatures",
          "LandLeaseYN", "NST_LastUpdateDate", "Latitude", "NST_LenderOwned", "ListAgentKey", "ListAgentMlsId",
          "ListingContractDate", "ListOfficeKey", "ListOfficeName", "ListOfficeMlsId", "LockBoxType",
          "Longitude", "LotFeatures", "SourceSystemName", "NST_ManufacturedHome", "MapCoordinateSource",
          "AdditionalParcelsYN", "NST_OfficeBoard", "ParcelNumber", "GarageSpaces", "PhotosCount", "PoolFeatures",
          "PostalCity", "NST_PotentialShortSale", "NST_PowerCompanyName", "NST_PresentUse",
          "NST_PropertySubTypeDesc", "PublicRemarks", "PublicSurveyRange", "PublicSurveySection",
          "PublicSurveyTownship", "NST_RentalLicenseYN", "RoadResponsibility", "Roof", "RoomType",
          "NST_AboveGradeSqFtTotal", "NST_BelowGradeSqFtTotal", "NST_MainLevelFinishedArea",
          "HighSchoolDistrict", "NST_SchoolDistrictNumber", "NST_SchoolDistrictPhone", "Sewer",
          "NST_SpecialSearch", "AboveGradeFinishedArea", "BelowGradeFinishedArea", raw_data, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25,
          $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35,
          $36, $37, $38, $39, $40,
          $41, $42, $43, $44, $45,
          $46, $47, $48, $49, $50,
          $51, $52, $53, $54, $55,
          $56, $57, $58, $59, $60,
          $61, $62, $63, $64, $65,
          $66, $67, $68, $69, $70,
          $71, $72, $73, $74, $75,
          $76, $77, $78, $79, $80,
          $81, $82, $83, $84, $85,
          $86, $87, $88, $89, $90,
          $91, $92, $93, $94, $95,
          $96, $97, $98, $99
        )
        ON CONFLICT ("ListingKey") DO UPDATE SET
          "ListingId" = EXCLUDED."ListingId",
          "ListPrice" = EXCLUDED."ListPrice",
          "BedroomsTotal" = EXCLUDED."BedroomsTotal",
          "BathroomsTotalInteger" = EXCLUDED."BathroomsTotalInteger",
          "City" = EXCLUDED."City",
          "StreetName" = EXCLUDED."StreetName",
          "StreetNumber" = EXCLUDED."StreetNumber",
          "StreetSuffix" = EXCLUDED."StreetSuffix",
          "CountyOrParish" = EXCLUDED."CountyOrParish",
          "PostalCode" = EXCLUDED."PostalCode",
          "StateOrProvince" = EXCLUDED."StateOrProvince",
          "LivingArea" = EXCLUDED."LivingArea",
          "LotSizeArea" = EXCLUDED."LotSizeArea",
          "LotSizeSquareFeet" = EXCLUDED."LotSizeSquareFeet",
          "WaterfrontYN" = EXCLUDED."WaterfrontYN",
          "DaysOnMarket" = EXCLUDED."DaysOnMarket",
          "YearBuilt" = EXCLUDED."YearBuilt",
          "StandardStatus" = EXCLUDED."StandardStatus",
          "PropertyType" = EXCLUDED."PropertyType",
          "PropertySubType" = EXCLUDED."PropertySubType",
          "NST_AmenitiesUnit" = EXCLUDED."NST_AmenitiesUnit",
          "Appliances" = EXCLUDED."Appliances",
          "NST_AgentOwner" = EXCLUDED."NST_AgentOwner",
          "AssociationYN" = EXCLUDED."AssociationYN",
          "AssociationFee" = EXCLUDED."AssociationFee",
          "NST_AssessmentPending" = EXCLUDED."NST_AssessmentPending",
          "NST_BathDesc" = EXCLUDED."NST_BathDesc",
          "NST_DiningRoomDescription" = EXCLUDED."NST_DiningRoomDescription",
          "Directions" = EXCLUDED."Directions",
          "DocumentsCount" = EXCLUDED."DocumentsCount",
          "DocumentsChangeTimestamp" = EXCLUDED."DocumentsChangeTimestamp",
          "Electric" = EXCLUDED."Electric",
          "ConstructionMaterials" = EXCLUDED."ConstructionMaterials",
          "Fencing" = EXCLUDED."Fencing",
          "FireplaceYN" = EXCLUDED."FireplaceYN",
          "FireplacesTotal" = EXCLUDED."FireplacesTotal",
          "NST_ForeclosureStatus" = EXCLUDED."NST_ForeclosureStatus",
          "FoundationArea" = EXCLUDED."FoundationArea",
          "NST_FractionalOwnershipYN" = EXCLUDED."NST_FractionalOwnershipYN",
          "RoadFrontageType" = EXCLUDED."RoadFrontageType",
          "NST_Fuel" = EXCLUDED."NST_Fuel",
          "ParkingFeatures" = EXCLUDED."ParkingFeatures",
          "NST_GarageSquareFeet" = EXCLUDED."NST_GarageSquareFeet",
          "AccessibilityFeatures" = EXCLUDED."AccessibilityFeatures",
          "Heating" = EXCLUDED."Heating",
          "OriginalEntryTimestamp" = EXCLUDED."OriginalEntryTimestamp",
          "NST_InternetOptions" = EXCLUDED."NST_InternetOptions",
          "NST_LakeAcres" = EXCLUDED."NST_LakeAcres",
          "NST_LakeChain" = EXCLUDED."NST_LakeChain",
          "NST_LakeDepth" = EXCLUDED."NST_LakeDepth",
          "WaterfrontFeatures" = EXCLUDED."WaterfrontFeatures",
          "LandLeaseYN" = EXCLUDED."LandLeaseYN",
          "NST_LastUpdateDate" = EXCLUDED."NST_LastUpdateDate",
          "Latitude" = EXCLUDED."Latitude",
          "NST_LenderOwned" = EXCLUDED."NST_LenderOwned",
          "ListAgentKey" = EXCLUDED."ListAgentKey",
          "ListAgentMlsId" = EXCLUDED."ListAgentMlsId",
          "ListingContractDate" = EXCLUDED."ListingContractDate",
          "ListOfficeKey" = EXCLUDED."ListOfficeKey",
          "ListOfficeName" = EXCLUDED."ListOfficeName",
          "ListOfficeMlsId" = EXCLUDED."ListOfficeMlsId",
          "LockBoxType" = EXCLUDED."LockBoxType",
          "Longitude" = EXCLUDED."Longitude",
          "LotFeatures" = EXCLUDED."LotFeatures",
          "SourceSystemName" = EXCLUDED."SourceSystemName",
          "NST_ManufacturedHome" = EXCLUDED."NST_ManufacturedHome",
          "MapCoordinateSource" = EXCLUDED."MapCoordinateSource",
          "AdditionalParcelsYN" = EXCLUDED."AdditionalParcelsYN",
          "NST_OfficeBoard" = EXCLUDED."NST_OfficeBoard",
          "ParcelNumber" = EXCLUDED."ParcelNumber",
          "GarageSpaces" = EXCLUDED."GarageSpaces",
          "PhotosCount" = EXCLUDED."PhotosCount",
          "PoolFeatures" = EXCLUDED."PoolFeatures",
          "PostalCity" = EXCLUDED."PostalCity",
          "NST_PotentialShortSale" = EXCLUDED."NST_PotentialShortSale",
          "NST_PowerCompanyName" = EXCLUDED."NST_PowerCompanyName",
          "NST_PresentUse" = EXCLUDED."NST_PresentUse",
          "NST_PropertySubTypeDesc" = EXCLUDED."NST_PropertySubTypeDesc",
          "PublicRemarks" = EXCLUDED."PublicRemarks",
          "PublicSurveyRange" = EXCLUDED."PublicSurveyRange",
          "PublicSurveySection" = EXCLUDED."PublicSurveySection",
          "PublicSurveyTownship" = EXCLUDED."PublicSurveyTownship",
          "NST_RentalLicenseYN" = EXCLUDED."NST_RentalLicenseYN",
          "RoadResponsibility" = EXCLUDED."RoadResponsibility",
          "Roof" = EXCLUDED."Roof",
          "RoomType" = EXCLUDED."RoomType",
          "NST_AboveGradeSqFtTotal" = EXCLUDED."NST_AboveGradeSqFtTotal",
          "NST_BelowGradeSqFtTotal" = EXCLUDED."NST_BelowGradeSqFtTotal",
          "NST_MainLevelFinishedArea" = EXCLUDED."NST_MainLevelFinishedArea",
          "HighSchoolDistrict" = EXCLUDED."HighSchoolDistrict",
          "NST_SchoolDistrictNumber" = EXCLUDED."NST_SchoolDistrictNumber",
          "NST_SchoolDistrictPhone" = EXCLUDED."NST_SchoolDistrictPhone",
          "Sewer" = EXCLUDED."Sewer",
          "NST_SpecialSearch" = EXCLUDED."NST_SpecialSearch",
          "AboveGradeFinishedArea" = EXCLUDED."AboveGradeFinishedArea",
          "BelowGradeFinishedArea" = EXCLUDED."BelowGradeFinishedArea",
          raw_data = EXCLUDED.raw_data,
          updated_at = CURRENT_TIMESTAMP;
      `;
      const values = [
        listing.ListingKey,                // $1
        listing.ListingId,                 // $2
        listing.ListPrice,                 // $3
        bedroomsTotalInt,                  // $4
        bathroomsTotalIntegerInt,          // $5
        listing.City,                      // $6
        listing.StreetName,                // $7
        streetNumberInt,                   // $8
        streetSuffix,                      // $9
        countyOrParish,                    // $10
        postalCode,                        // $11
        stateOrProvince,                   // $12
        livingAreaInt,                     // $13
        listing.LotSizeArea,               // $14
        lotSizeSquareFeetInt,              // $15
        listing.WaterfrontYN,              // $16
        daysOnMarketInt,                   // $17
        yearBuiltInt,                      // $18
        listing.StandardStatus,            // $19
        listing.PropertyType,              // $20
        listing.PropertySubType,           // $21
        listing.NST_AmenitiesUnit,         // $22
        listing.Appliances,                // $23
        NST_AgentOwner,                    // $24
        listing.AssociationYN,             // $25
        listing.AssociationFee,            // $26
        NST_AssessmentPending,             // $27
        listing.NST_BathDesc,              // $28
        listing.NST_DiningRoomDescription, // $29
        listing.Directions,                // $30
        intify(listing.DocumentsCount),    // $31
        listing.DocumentsChangeTimestamp,  // $32
        listing.Electric,                  // $33
        listing.ConstructionMaterials,     // $34
        listing.Fencing,                   // $35
        listing.FireplaceYN,               // $36
        intify(listing.FireplacesTotal),   // $37
        listing.NST_ForeclosureStatus,     // $38
        intify(listing.FoundationArea),    // $39
        NST_FractionalOwnershipYN,         // $40
        listing.RoadFrontageType,            // $41
        listing.NST_Fuel,                    // $42
        listing.ParkingFeatures,             // $43
        listing.NST_GarageSquareFeet,        // $44
        listing.AccessibilityFeatures,       // $45
        listing.Heating,                     // $46
        listing.OriginalEntryTimestamp,      // $47
        listing.NST_InternetOptions,         // $48
        listing.NST_LakeAcres,               // $49
        NST_LakeChain,                     // $50
        listing.NST_LakeDepth,               // $51
        listing.WaterfrontFeatures,          // $52
        listing.LandLeaseYN,                 // $53
        listing.NST_LastUpdateDate,          // $54
        listing.Latitude,                    // $55
        listing.NST_LenderOwned,             // $56
        listing.ListAgentKey,                // $57
        listing.ListAgentMlsId,              // $58
        listing.ListingContractDate,         // $59
        listing.ListOfficeKey,               // $60
        listing.ListOfficeName,              // $61
        listing.ListOfficeMlsId,             // $62
        listing.LockBoxType,                 // $63
        listing.Longitude,                   // $64
        listing.LotFeatures,                 // $65
        listing.SourceSystemName,            // $66
        NST_ManufacturedHome,              // $67
        listing.MapCoordinateSource,         // $68
        listing.AdditionalParcelsYN,         // $69
        listing.NST_OfficeBoard,             // $70
        listing.ParcelNumber,                // $71
        garageSpacesInt,                     // $72
        photosCountInt,                      // $73
        listing.PoolFeatures,                // $74
        listing.PostalCity,                  // $75
        NST_PotentialShortSale,            // $76
        listing.NST_PowerCompanyName,        // $77
        listing.NST_PresentUse,              // $78
        listing.NST_PropertySubTypeDesc,     // $79
        listing.PublicRemarks,               // $80
        listing.PublicSurveyRange,           // $81
        listing.PublicSurveySection,         // $82
        listing.PublicSurveyTownship,        // $83
        NST_RentalLicenseYN,               // $84
        listing.RoadResponsibility,          // $85
        listing.Roof,                        // $86
        listing.RoomType,                    // $87
        listing.NST_AboveGradeSqFtTotal,      // $88
        listing.NST_BelowGradeSqFtTotal,      // $89
        listing.NST_MainLevelFinishedArea,    // $90
        listing.HighSchoolDistrict,          // $91
        listing.NST_SchoolDistrictNumber,      // $92
        listing.NST_SchoolDistrictPhone,      // $93
        listing.Sewer,                       // $94
        listing.NST_SpecialSearch,           // $95
        intify(listing.AboveGradeFinishedArea), // $96
        intify(listing.BelowGradeFinishedArea), // $97
        listing.raw_data,                    // $98
        null                                 // $99: updated_at defaults to CURRENT_TIMESTAMP
      ];
      await pool.query(query, values);
    }
    console.log('Data ingestion complete.');
  } catch (error) {
    console.error('Error during ingestion:', error);
  } finally {
    await pool.end();
  }
}

ingestListings();