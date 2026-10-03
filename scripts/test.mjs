import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const caseCode=read('src/data/case2019.ts');
const reducer=read('src/app/demoReducer.ts');
const guards=read('src/domain/guards.ts');
const evidence=read('src/data/evidenceMap.ts');
const xml=read('public/demo/2019/pacs008-demo.xml');
const checks=[
  ['workflow includes applicability running',caseCode.includes("'APPLICABILITY_RUNNING'" )],
  ['workflow includes waiting supplement',caseCode.includes("'WAITING_SUPPLEMENT'" )],
  ['precheck stage model exists',caseCode.includes('PrecheckStage')],
  ['precheck completion is reducer-driven',reducer.includes("case'RUN_PRECHECK'" )],
  ['operator guard exists',guards.includes('canSubmitOperator')],
  ['reviewer guard exists',guards.includes('canCompleteReviewer')],
  ['evidence map covers payment',evidence.includes("paymentAmount")],
  ['evidence map covers invoice',evidence.includes("invoiceAmount")],
  ['evidence map covers packing',evidence.includes("quantity")],
  ['evidence map covers shipping',evidence.includes("route")],
  ['pacs008 contains payment amount',xml.includes('180000.00')],
  ['pacs008 contains payer',xml.includes('MARCO FOERSTER GMBH')],
  ['pacs008 contains payee',xml.includes('TIANJIN ESHOW CO., LTD.')],
  ['pacs008 contains narrative',xml.includes('PAYMENT FOR INV EXP2019033 / GOODS TRADE')],
];
const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
if(failed.length) process.exit(1);
