export type DocumentId = 'pacs008'|'invoice'|'packing'|'shipping';
export type Evidence = {id:string;factId:string;documentId:DocumentId;label:string;originalText:string;bbox?:{x:number;y:number;width:number;height:number};xmlKey?:string};
export const evidenceMap: Evidence[] = [
 {id:'paymentAmount',factId:'paymentAmount',documentId:'pacs008',label:'结算金额',originalText:'USD 180000.00',xmlKey:'IntrBkSttlmAmt'},
 {id:'payer',factId:'payer',documentId:'pacs008',label:'付款方',originalText:'MARCO FOERSTER GMBH',xmlKey:'Dbtr/Nm'},
 {id:'payee',factId:'payee',documentId:'pacs008',label:'收款方',originalText:'TIANJIN ESHOW CO., LTD.',xmlKey:'Cdtr/Nm'},
 {id:'narrative',factId:'narrative',documentId:'pacs008',label:'交易附言',originalText:'PAYMENT FOR INV EXP2019033 / GOODS TRADE',xmlKey:'RmtInf/Ustrd'},
 {id:'invoiceAmount',factId:'invoiceAmount',documentId:'invoice',label:'发票金额',originalText:'USD 180,000.00',bbox:{x:.70,y:.52,width:.23,height:.07}},
 {id:'buyer',factId:'buyer',documentId:'invoice',label:'买方',originalText:'MARCO FOERSTER GMBH',bbox:{x:.05,y:.22,width:.38,height:.10}},
 {id:'exporter',factId:'exporter',documentId:'invoice',label:'出口商',originalText:'TIANJIN ESHOW CO., LTD.',bbox:{x:.05,y:.10,width:.38,height:.10}},
 {id:'invoiceNo',factId:'invoiceNo',documentId:'invoice',label:'发票号',originalText:'EXP2019033',bbox:{x:.72,y:.10,width:.20,height:.06}},
 {id:'quantity',factId:'quantity',documentId:'packing',label:'数量',originalText:'10,000 PCS',bbox:{x:.55,y:.47,width:.25,height:.10}},
 {id:'packages',factId:'packages',documentId:'packing',label:'包装',originalText:'200 CARTONS',bbox:{x:.16,y:.40,width:.28,height:.12}},
 {id:'route',factId:'route',documentId:'shipping',label:'运输路线',originalText:'TIANJIN TO HAMBURG',bbox:{x:.12,y:.25,width:.65,height:.12}}
];
export const getEvidence=(id:string)=>evidenceMap.find(x=>x.id===id);
