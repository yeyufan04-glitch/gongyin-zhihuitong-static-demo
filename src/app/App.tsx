import {useState} from 'react';
import {ChevronRight,FileCheck2,RotateCcw,ShieldCheck,Workflow} from 'lucide-react';
import {useDemo} from './DemoContext';
import {EnterprisePage} from '../pages/EnterprisePage';
import {BankPage} from '../pages/BankPage';
import {RuntimePage} from '../pages/RuntimePage';
type Role='home'|'enterprise'|'bank'|'runtime';
export function App(){
 const {state,dispatch}=useDemo(); const [role,setRole]=useState<Role>('home');
 const reset=()=>{dispatch({type:'RESET'});setRole('home')};
 if(role==='home') return <main className="home"><div className="home-inner"><div className="brand-mark">工银智汇通</div><h1>工银智汇通</h1><h2 className="home-subtitle">企业货物贸易出口收汇可信智能作业平台</h2><div className="capabilities"><Capability icon={<Workflow/>} title="全流程智能编排" text="规则匹配 · 动态任务 · 材料复用 · 状态协同"/><Capability icon={<FileCheck2/>} title="多源协同审核" text="报文解析 · 材料识别 · 事实构建 · 关系核验"/><Capability icon={<ShieldCheck/>} title="高可信智能执行" text="规则约束 · 证据检查 · 动作控制 · 人工接管"/></div><div className="flow-strip"><span>境外来款</span><ChevronRight/><span>企业办理</span><ChevronRight/><span>智能预审</span><ChevronRight/><span>银行审核</span><ChevronRight/><span>后续授权准备</span></div><button className="primary hero-button" onClick={()=>{dispatch({type:'SET_WORKFLOW',state:'PAYMENT_RECEIVED'});setRole('runtime')}}>开始演示<ChevronRight size={18}/></button><div className="home-note">公开交互演示 · 货物贸易出口收汇案例</div></div></main>;
 return <div className="app-shell"><header className="app-header"><div className="header-brand" onClick={()=>setRole('home')}><span>工银智汇通</span><small>企业货物贸易出口收汇可信智能作业平台</small></div><nav><button className={role==='enterprise'?'active':''} onClick={()=>setRole('enterprise')}>企业端</button><button className={role==='bank'?'active':''} onClick={()=>setRole('bank')}>银行端</button><button className={role==='runtime'?'active':''} onClick={()=>setRole('runtime')}>系统运行端</button></nav><div className="header-actions"><span className="case-pill">{state.caseId}</span><button className="icon-button" title="重置演示" onClick={reset}><RotateCcw size={16}/></button></div></header>{role==='enterprise'&&<EnterprisePage/>}{role==='bank'&&<BankPage/>}{role==='runtime'&&<RuntimePage onGoEnterprise={()=>setRole('enterprise')}/>}<footer>竞赛原型演示。贸易材料采用教学业务样本，pacs.008、企业分类及业务条件为演示配置，不代表真实工商银行生产数据。</footer></div>
}
function Capability({icon,title,text}:{icon:React.ReactNode;title:string;text:string}){return <div className="capability"><div className="cap-icon">{icon}</div><div><h3>{title}</h3><p>{text}</p></div></div>}
