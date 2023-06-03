export class GreensAgentDespCountWeightDetails {
    agentCropReceivedNo: number;
    cropSchemeCode: string;
    greensAgentGRNNo: number;
    agentCropReceivedCrates: number;
    agentCropReceivedQty: number;
    uniqueId: number;
    isDisabled: boolean;
}

export class GreensAgentReceivedDetails {
    greensAgentGRNNo: number;
    orgOfficeNo: number;
    greensAgentGRNDateTime: Date;
    agentOrgID: number;
    invoiceDCNo: string;
    invoiceDCDate: Date;
    cropGroupCode: string;
    cropNameCode: string;
    pSNumber: string;
    greensAgentDespQty: number;
    greensAgentDespCrates: number;
    inwardGatePassNo: string;
    isOnGoing: boolean;
    totalQuantityReceived: number;
    weightMode: string;
    employeeID: string;
    greensAgentDespCountWeightDetails: Array<GreensAgentDespCountWeightDetails>;
    greensAgentActualWeightDetails: Array<GreensAgentActualWeightDetails>;
    GreensAgentGradesActualDetails: Array<GreensAgentGradesActualDetails>;

}

export class GreensAgentActualWeightDetails {
    actualCountWeightNo: number;
    greensAgentGRNNo: number;
    cropNameCode: string;
    cropSchemeCode: string;
    actualWeightNoofCrates: number;
    actualCratesTareWeight: number;
    slNoFrom: string;
    slNoTo: string;
    actualGrossWeight: number;
    actualTareWeight: number;
    actualNetWeight: number;
}

export class GreensAgentGradesActualDetails {
    agentReceivedNo: number;
    greensAgentGRNNo: number;
    cropNameCode: string;
    cropSchemeCode: string;
    countTotalCrates: number;
    countTotalWeight: number;
}