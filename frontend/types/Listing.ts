export interface Media {
    "@odata.id"?: string;
    ResourceRecordKey: string;
    Order: number;
    MediaObjectID: string;
    ImageWidth: number;
    ImageHeight: number;
    ImageSizeDescription: string;
    MediaURL: string;
    MediaModificationTimestamp: string;
    MediaKey: string;
    LongDescription?: string;
  }
  export interface MediaItem {
    MediaKey?: string;
    MediaURL: string;
  }
  
  export interface Listing {
    "@odata.id"?: string;
    ListingKey: string;
    LotSizeArea?: number;
    NST_AgeOfProperty?: string;
    NST_AgentOwner?: string;
    InternetAutomatedValuationDisplayYN?: boolean;
    InternetConsumerCommentYN?: boolean;
    NST_AmenitiesUnit?: string;
    Appliances?: string[];
    NST_AssessmentPending?: string;
    AssociationFeeIncludes?: string[];
    AssociationFeeFrequency?: string;
    AssociationYN?: boolean;
    AssociationFee?: number;
    AssociationName?: string;
    AssociationPhone?: string;
    PropertyAttachedYN?: boolean;
    Basement?: string[];
    BasementYN?: boolean;
    NST_BathDesc?: string;
    BathroomsOneQuarter?: number;
    BathroomsFull?: number;
    BathroomsHalf?: number;
    BathroomsThreeQuarter?: number;
    BathroomsTotalInteger?: number;
    BedroomsTotal?: number;
    City?: string;
    PropertyType?: string;
    NST_ConstructionMaterialsDesc?: string;
    NewConstructionYN?: boolean;
    Contingency?: string;
    Cooling?: string[];
    CountyOrParish?: string;
    NST_DPResource?: string;
    DaysOnMarket?: number;
    CumulativeDaysOnMarket?: number;
    NST_DiningRoomDescription?: string;
    Directions?: string;
    InternetAddressDisplayYN?: boolean;
    InternetEntireListingDisplayYN?: boolean;
    Electric?: string[];
    ConstructionMaterials?: string[];
    Fencing?: string[];
    FireplaceFeatures?: string[];
    FireplaceYN?: boolean;
    FireplacesTotal?: number;
    NST_ForeclosureStatus?: string;
    FoundationArea?: number;
    NST_FractionalOwnershipYN?: string;
    RoadFrontageType?: string[];
    NST_Fuel?: string;
    ParkingFeatures?: string[];
    NST_GarageDimensions?: string;
    NST_GarageSquareFeet?: string;
    AccessibilityFeatures?: string[];
    Heating?: string[];
    OriginalEntryTimestamp?: string;
    LandLeaseAmount?: number;
    LandLeaseYN?: boolean;
    NST_LastUpdateDate?: string;
    Latitude?: number;
    NST_LenderOwned?: string;
    ListAgentKey?: string;
    ListAgentMlsId?: string;
    ListingContractDate?: string;
    ListOfficeKey?: string;
    ListOfficeName?: string;
    ListOfficeMlsId?: string;
    ListPrice: number;
    LivingArea?: number;
    LockBoxType?: string[];
    Longitude?: number;
    LotSizeDimensions?: string;
    LotSizeSquareFeet?: number;
    LotSizeUnits?: string;
    ListingId?: string;
    SourceSystemName?: string;
    NST_ManufacturedHome?: string;
    MapCoordinateSource?: string;
    AdditionalParcelsYN?: boolean;
    NST_OfficeBoard?: string;
    ParcelNumber?: string;
    GarageSpaces?: number;
    NST_ParkingOpen?: string;
    PhotosCount?: number;
    PoolFeatures?: string[];
    PostalCity?: string;
    PostalCode?: string;
    NST_PotentialShortSale?: string;
    NST_PowerCompanyName?: string;
    NST_PresentUse?: string;
    NST_PropertySubTypeDesc?: string;
    PublicRemarks?: string;
    PublicSurveyRange?: string;
    PublicSurveySection?: string;
    PublicSurveyTownship?: string;
    NST_RentalLicenseYN?: string;
    NST_Restrictions?: string;
    RoadResponsibility?: string[];
    Roof?: string[];
    RoomType?: string[];
    NST_AboveGradeSqFtTotal?: string;
    NST_BelowGradeSqFtTotal?: string;
    NST_MainLevelFinishedArea?: string;
    HighSchoolDistrict?: string;
    NST_SchoolDistrictNumber?: string;
    NST_SchoolDistrictPhone?: string;
    Sewer?: string[];
    AboveGradeFinishedArea?: number;
    BelowGradeFinishedArea?: number;
    StateOrProvince?: string;
    StandardStatus?: string;
    Levels?: string[];
    StreetName?: string;
    StreetNumber?: string;
    StreetNumberNumeric?: number;
    StreetSuffix?: string;
    PropertySubType?: string;
    SubdivisionName?: string;
    NST_TaxWithAssessments?: string;
    TaxYear?: number;
    TaxAnnualAmount?: number;
    WaterSource?: string[];
    WaterfrontYN?: boolean;
    YearBuilt?: number;
    ZoningDescription?: string;
    OriginatingSystemName?: string;
    ModificationTimestamp?: string;
    media?: MediaItem[];
    PhotosChangeTimestamp?: string;
    MlgCanView?: boolean;
    MlgCanUse?: string[];
  }