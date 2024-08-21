export interface IProduct {
    Identifier: string;
    DatasheetUrl: string;
    Description: string;
    ExportControlClassificationNumber: string;
    ExtendedShelfLife: boolean;
    FullBoxQty: number;
    GenericProductIdentifier: string;
    HtsCode: string;
    ChangeOrderWindow: string;
    IndustryPackageType: string;
    InventoryStatus: string;
    JedecCode: string;
    LeadTimeWeeks: string;
    Length: number;
    LifeCycleStatus: string;
    LifetimeBuy: boolean;
    MaterialContentUrl: string;
    MaxHeight: number;
    MilitaryGoods: boolean;
    MinOrderQty: number;
    NextIncrementQty: number;
    Obsolete: boolean;
    OkayToOrder: boolean;
    PackageCarrier: string;
    PackageGroup: string;
    PackageType: string;
    Pin: number;
    Pitch: number;
    Price: {
      Quantity: number;
      Value: number;
    };
    ProductFamilyDescription: string;
    QualityEstimatorUrl: string;
    StandardPackQty: number;
    StopShip: boolean;
    Thickness: number;
    Url: string;
    Width: number;
  }
  
  // Quality interface
  export interface IQuality {
    AutomotiveQualification: boolean;
    CommodityGroup: string;
    DieSize: string;
    DefectivePartsPerMillion: string;
    FailuresInTime: string;
    MeanTimeBetweenFailures: string;
    ProcessTechnology: string[];
  }
  
  // Parametric interface
  export interface IParametric {
    Description: string;
    Type: string;
    Value: string;
    Unit: string;
    UnitDescription: string;
    Range: {
      Min: string;
      Max: string;
    };
  }
  
  // Device interface
  export interface IDevice {
    Product: IProduct;
    Quality: IQuality;
    Parametric: IParametric;
  }

  export class Product implements IProduct {
    Identifier: string;
    DatasheetUrl: string;
    Description: string;
    ExportControlClassificationNumber: string;
    ExtendedShelfLife: boolean;
    FullBoxQty: number;
    GenericProductIdentifier: string;
    HtsCode: string;
    ChangeOrderWindow: string;
    IndustryPackageType: string;
    InventoryStatus: string;
    JedecCode: string;
    LeadTimeWeeks: string;
    Length: number;
    LifeCycleStatus: string;
    LifetimeBuy: boolean;
    MaterialContentUrl: string;
    MaxHeight: number;
    MilitaryGoods: boolean;
    MinOrderQty: number;
    NextIncrementQty: number;
    Obsolete: boolean;
    OkayToOrder: boolean;
    PackageCarrier: string;
    PackageGroup: string;
    PackageType: string;
    Pin: number;
    Pitch: number;
    Price: {
      Quantity: number;
      Value: number;
    };
    ProductFamilyDescription: string;
    QualityEstimatorUrl: string;
    StandardPackQty: number;
    StopShip: boolean;
    Thickness: number;
    Url: string;
    Width: number;

    constructor(
      Identifier: string = "",
      DatasheetUrl: string = "",
      Description: string = "",
      ExportControlClassificationNumber: string = "",
      ExtendedShelfLife: boolean = false,
      FullBoxQty: number = 0,
      GenericProductIdentifier: string = "",
      HtsCode: string = "",
      ChangeOrderWindow: string = "",
      IndustryPackageType: string = "",
      InventoryStatus: string = "",
      JedecCode: string = "",
      LeadTimeWeeks: string = "",
      Length: number = 0,
      LifeCycleStatus: string = "",
      LifetimeBuy: boolean = false,
      MaterialContentUrl: string = "",
      MaxHeight: number = 0,
      MilitaryGoods: boolean = false,
      MinOrderQty: number = 0,
      NextIncrementQty: number = 0,
      Obsolete: boolean = false,
      OkayToOrder: boolean = false,
      PackageCarrier: string = "",
      PackageGroup: string = "",
      PackageType: string = "",
      Pin: number = 0,
      Pitch: number = 0,
      Price: {
        Quantity: number,
        Value: number,
      } = { Quantity: 0, Value: 0 },
      ProductFamilyDescription: string = "",
      QualityEstimatorUrl: string = "",
      StandardPackQty: number = 0,
      StopShip: boolean = false,
      Thickness: number = 0,
      Url: string = "",
      Width: number = 0
    ) {
      this.Identifier = Identifier;
      this.DatasheetUrl = DatasheetUrl;
      this.Description = Description;
      this.ExportControlClassificationNumber = ExportControlClassificationNumber;
      this.ExtendedShelfLife = ExtendedShelfLife;
      this.FullBoxQty = FullBoxQty;
      this.GenericProductIdentifier = GenericProductIdentifier;
      this.HtsCode = HtsCode;
      this.Identifier = Identifier;
      this.ChangeOrderWindow = ChangeOrderWindow;
      this.IndustryPackageType = IndustryPackageType;
      this.InventoryStatus = InventoryStatus;
      this.JedecCode = JedecCode;
      this.LeadTimeWeeks = LeadTimeWeeks;
      this.Length = Length;
      this.LifeCycleStatus = LifeCycleStatus;
      this.LifetimeBuy = LifetimeBuy;
      this.MaterialContentUrl = MaterialContentUrl;
      this.MaxHeight = MaxHeight;
      this.MilitaryGoods = MilitaryGoods;
      this.MinOrderQty = MinOrderQty;
      this.NextIncrementQty = NextIncrementQty;
      this.Obsolete = Obsolete;
      this.OkayToOrder = OkayToOrder;
      this.PackageCarrier = PackageCarrier;
      this.PackageGroup = PackageGroup;
      this.PackageType = PackageType;
      this.Pin = Pin;
      this.Pitch = Pitch;
      this.Price = Price;
      this.ProductFamilyDescription = ProductFamilyDescription;
      this.QualityEstimatorUrl = QualityEstimatorUrl;
      this.StandardPackQty = StandardPackQty;
      this.StopShip = StopShip;
      this.Thickness = Thickness;
      this.Url = Url;
      this.Width = Width;
    }
}
  
  export class Quality implements IQuality {
    AutomotiveQualification: boolean;
    CommodityGroup: string;
    DieSize: string;
    DefectivePartsPerMillion: string;
    FailuresInTime: string;
    MeanTimeBetweenFailures: string;
    ProcessTechnology: string[];

    constructor(
      AutomotiveQualification: boolean = false,
      CommodityGroup: string = "",
      DieSize: string = "",
      DefectivePartsPerMillion: string = "",
      FailuresInTime: string = "",
      MeanTimeBetweenFailures: string = "",
      ProcessTechnology: string[] = []
    ) {
        this.AutomotiveQualification = AutomotiveQualification;
        this.CommodityGroup = CommodityGroup;
        this.DefectivePartsPerMillion = DefectivePartsPerMillion;
        this.DieSize = DieSize;
        this.FailuresInTime = FailuresInTime;
        this.MeanTimeBetweenFailures = MeanTimeBetweenFailures;
        this.ProcessTechnology = ProcessTechnology;
    }
  }
  
  export class Parametric implements IParametric {
    Description: string;
    Type: string;
    Value: string;
    Unit: string;
    UnitDescription: string;
    Range: {
      Min: string;
      Max: string;
    };
  
    constructor(
      Description: string = "",
      Type: string = "",
      Value: string = "",
      Unit: string = "",
      UnitDescription: string = "",
      Range: { Min: string; Max: string } = { Min: "", Max: "" }
    ) {
      this.Description = Description;
      this.Range = Range;
      this.Type = Type;
      this.Value = Value;
      this.Unit = Unit;
      this.UnitDescription = UnitDescription;
    }
  }
  
  export class Device implements IDevice {
    Product: Product;
    Quality: IQuality;
    Parametric: IParametric;
  
    constructor(
      _Product: Product = new Product(),
      _Quality: Quality = new Quality(),
      _Parametric: Parametric = new Parametric()
    ) {
      this.Product = _Product;
      this.Quality = _Quality;
      this.Parametric = _Parametric;
    }
  }