import {DemoCase} from '../data/case2019';
export const canStartPrecheck=(s:DemoCase)=>({allowed:s.materials.every(m=>m.status==='已提交'),reasons:s.materials.filter(m=>m.status!=='已提交').map(m=>`${m.name}尚未提交`)});
export const canSubmitOperator=(s:DemoCase)=>{const reasons:string[]=[];if(s.workflow!=='PRECHECK_COMPLETED')reasons.push('智能预审尚未完成');if(!s.analysisRun)reasons.push('缺少有效分析批次');if(s.materials.some(m=>m.type==='必要材料'&&m.status!=='已提交'))reasons.push('必要材料未完成');if(s.supplementalTask)reasons.push('存在未完成补充任务');if(s.operatorSubmitted)reasons.push('经办结果已经提交');return {allowed:reasons.length===0,reasons}};
export const canCompleteReviewer=(s:DemoCase)=>({allowed:s.workflow==='WAITING_REVIEWER'&&s.operatorSubmitted,reasons:s.workflow!=='WAITING_REVIEWER'?['尚未进入复核阶段']:[]});
