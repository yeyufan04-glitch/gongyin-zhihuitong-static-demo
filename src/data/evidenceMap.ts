export type DocumentId = 'pacs008'|'invoice'|'packing'|'shipping';
export type ImageEvidence = {type:'image';id:string;factId:string;documentId:'invoice'|'packing'|'shipping';label:string;originalText:string;sourceBox:{sourceWidth:number;sourceHeight:number;x:number;y:number;width:number;height:number}};
export type XmlEvidence = {type:'xml';id:string;factId:string;documentId:'pacs008';label:string;originalText:string;matchText:string;xmlKey:string};
export type Evidence = ImageEvidence|XmlEvidence;
export const evidenceMap: Evidence[] = [
 {type:'xml',id:'paymentAmount',factId:'paymentAmount',documentId:'pacs008',label:'结算金额',originalText:'USD 180000.00',matchText:'180000.00',xmlKey:'IntrBkSttlmAmt'},
 {type:'xml',id:'payer',factId:'payer',documentId:'pacs008',label:'付款方',originalText:'MARCO FOERSTER GMBH',matchText:'MARCO FOERSTER GMBH',xmlKey:'Dbtr/Nm'},
 {type:'xml',id:'payee',factId:'payee',documentId:'pacs008',label:'收款方',originalText:'TIANJIN ESHOW CO., LTD.',matchText:'TIANJIN ESHOW CO., LTD.',xmlKey:'Cdtr/Nm'},
 {type:'xml',id:'narrative',factId:'narrative',documentId:'pacs008',label:'交易附言',originalText:'PAYMENT FOR INV EXP2019033 / GOODS TRADE',matchText:'PAYMENT FOR INV EXP2019033 / GOODS TRADE',xmlKey:'RmtInf/Ustrd'},
 {type:'image',id:'invoiceAmount',factId:'invoiceAmount',documentId:'invoice',label:'发票金额',originalText:'USD 180,000.00',sourceBox:{sourceWidth:551,sourceHeight:647,x:459,y:373,width:77,height:52}},
 {type:'image',id:'buyer',factId:'buyer',documentId:'invoice',label:'买方',originalText:'MARCO FOERSTER GMBH',sourceBox:{sourceWidth:551,sourceHeight:647,x:39,y:143,width:188,height:35}},
 {type:'image',id:'exporter',factId:'exporter',documentId:'invoice',label:'出口商',originalText:'TIANJIN ESHOW CO., LTD.',sourceBox:{sourceWidth:551,sourceHeight:647,x:39,y:76,width:190,height:35}},
 {type:'image',id:'invoiceNo',factId:'invoiceNo',documentId:'invoice',label:'发票号',originalText:'EXP2019033',sourceBox:{sourceWidth:551,sourceHeight:647,x:429,y:78,width:83,height:19}},
 {type:'image',id:'quantity',factId:'quantity',documentId:'packing',label:'数量',originalText:'10,000 PCS',sourceBox:{sourceWidth:568,sourceHeight:672,x:397,y:402,width:70,height:22}},
 {type:'image',id:'packages',factId:'packages',documentId:'packing',label:'包装',originalText:'200 CARTONS',sourceBox:{sourceWidth:568,sourceHeight:672,x:111,y:457,width:144,height:25}},
 {type:'image',id:'route',factId:'route',documentId:'shipping',label:'运输路线',originalText:'FROM TIANJIN, CHINA TO HAMBURG, GERMANY BY SEA',sourceBox:{sourceWidth:404,sourceHeight:530,x:10,y:105,width:137,height:40}}
];
export const getEvidence=(id:string)=>evidenceMap.find(x=>x.id===id);
export function validateEvidenceMap(){return evidenceMap.every(e=>e.type==='xml'?e.matchText.length>0:e.sourceBox.sourceWidth>0&&e.sourceBox.sourceHeight>0&&e.sourceBox.x>=0&&e.sourceBox.y>=0&&e.sourceBox.x+e.sourceBox.width<=e.sourceBox.sourceWidth&&e.sourceBox.y+e.sourceBox.height<=e.sourceBox.sourceHeight)}
