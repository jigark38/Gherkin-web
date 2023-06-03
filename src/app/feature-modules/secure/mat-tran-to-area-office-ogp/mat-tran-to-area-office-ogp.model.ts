export class MaterialTransferFormModel {
    public EmployeeId: number;
    public AreaName: string;
    public OgpDate: Date;
    public OgpNumber: string;
    public TransporterName: string;
    public VehicleNumber: string;
    public DriverName: string;
    public DriverContactNumber: string;
    public FieldStaff: string;
    public FreightAmount: number;
    public AdvanceAmount: number;
    public ApproxMaterialAmount: number;
    public DespatchDate: Date;
    public Remarks: string;
}

export class MaterialTransferModel {
    public Id: number;
    public RmTransferNo: string;
    public EmployeeId: number;
    public AreaId: string;
    public OgpDate: Date;
    public OgpNumber: string;
    public TransporterName: string;
    public VehicleNumber: string;
    public DriverName: string;
    public DriverContactNumber: string;
    public FieldStaff: string;
    public FreightAmount: number;
    public AdvanceAmount: number;
    public ApproxMaterialAmount: number;
    public DespatchDate: Date;
    public Remarks: string;
    public AreaName: string;
    public TotalMaterial: number;
}
