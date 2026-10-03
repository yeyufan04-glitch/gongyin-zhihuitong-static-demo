import { useEffect, useRef, useState } from "react";
import { Check, ShieldCheck, ChevronRight, FileText } from "lucide-react";
import { useDemo } from "../app/DemoContext";
import { CaseStatusBar } from "../components/CaseStatusBar";
import { assetUrl } from "../utils/asset";
import { getEvidence, Evidence } from "../data/evidenceMap";
import { canSubmitOperator } from "../domain/guards";
export function BankPage({initialMode='list'}:{initialMode?:'list'|'operator'|'reviewer'}) {
  const { state, dispatch } = useDemo();
  const [mode, setMode] = useState<"list" | "operator" | "reviewer">(initialMode);
  const [drawer, setDrawer] = useState(false);
  const [notice, setNotice] = useState("");
  if (mode === "list")
    return (
      <main className="page">
        <CaseStatusBar />
        <div className="page-heading">
          <div>
            <div className="eyebrow">银行端 · 汇入业务工作台</div>
            <h1>汇入业务</h1>
            <p>
              经办审核　　复核审核{" "}
              {state.operatorSubmitted && <b className="dot-inline">1</b>}
            </p>
          </div>
          <button
            className="secondary"
            onClick={() =>
              setMode(state.operatorSubmitted ? "reviewer" : "operator")
            }
          >
            {state.operatorSubmitted ? "进入复核审核" : "进入经办审核"}
            <ChevronRight size={15} />
          </button>
        </div>
        <div className="case-list-card">
          <div className="list-head">
            <span>业务编号</span>
            <span>企业</span>
            <span>金额</span>
            <span>业务性质</span>
            <span>状态</span>
            <span></span>
          </div>
          <div className="list-row">
            <strong>{state.caseId}</strong>
            <span>{state.enterprise.cn}</span>
            <span>
              {state.payment.currency} {state.payment.amount}
            </span>
            <span>{state.conditionSnapshot.business}</span>
            <span className="tag">
              {state.operatorSubmitted ? "待复核" : "待经办"}
            </span>
            <button
              className="secondary"
              onClick={() =>
                setMode(state.operatorSubmitted ? "reviewer" : "operator")
              }
            >
              进入审核
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </main>
    );
  return (
    <main className="page">
      <CaseStatusBar />
      <div className="bank-tabs">
        <button
          className={mode === "operator" ? "active" : ""}
          onClick={() => setMode("operator")}
        >
          经办审核
        </button>
        <button
          className={mode === "reviewer" ? "active" : ""}
          onClick={() => setMode("reviewer")}
        >
          复核审核 {state.operatorSubmitted && <b className="dot-inline">1</b>}
        </button>
      </div>
      {mode === "operator" ? (
        <Operator
          onTrust={() => setDrawer(true)}
          onRequest={() => {
            dispatch({ type: "REQUEST_SUPPLEMENT" });
            setNotice("补充任务已发送至企业端");
          }}
          onSubmit={() => {
            const g = canSubmitOperator(state);
            if (!g.allowed) {
              setNotice(`当前暂不能提交复核：${g.reasons.join("、")}`);
              return;
            }
            setDrawer(true);
          }}
          notice={notice}
        />
      ) : (
        <Reviewer onComplete={() => dispatch({ type: "COMPLETE_REVIEW" })} />
      )}{" "}
      {notice && (
        <div className="toast" onClick={() => setNotice("")}>
          {notice}
        </div>
      )}
      {drawer && (
        <TrustModal
          onClose={() => setDrawer(false)}
          onConfirm={() => {
            if (canSubmitOperator(state).allowed) {
              dispatch({ type: "SUBMIT_OPERATOR" });
              setDrawer(false);
              setNotice("已提交复核");
            } else {
              setDrawer(false);
            }
          }}
          allowed={canSubmitOperator(state).allowed}
          reasons={canSubmitOperator(state).reasons}
        />
      )}
    </main>
  );
}
function Operator({
  onTrust,
  onRequest,
  onSubmit,
  notice,
}: {
  onTrust: () => void;
  onRequest: () => void;
  onSubmit: () => void;
  notice: string;
}) {
  const { state, dispatch } = useDemo();
  const [doc, setDoc] = useState<
    "pacs008" | "invoice" | "packing" | "shipping"
  >(state.selectedDocument);
  const evidence = getEvidence(state.selectedEvidence || "");
  const selectFact = (id: string) => {
    dispatch({ type: "SELECT_EVIDENCE", id });
    const e = getEvidence(id);
    if (e) setDoc(e.documentId);
  };
  const docFile =
    doc === "invoice"
      ? "demo/2019/commercial-invoice.jpg"
      : doc === "packing"
        ? "demo/2019/packing-list.jpg"
        : doc === "shipping"
          ? "demo/2019/shipping-note.jpg"
          : "";
  return (
    <>
      <div className="operator-header">
        <b>{state.caseId}</b>
        <span>{state.enterprise.cn}</span>
        <span>{state.conditionSnapshot.business}</span>
        <span>{state.conditionSnapshot.tradeClass}</span>
        <span>{state.conditionSnapshot.customerClass}</span>
        <span className="tag">
          {state.workflow === "PRECHECK_COMPLETED"
            ? "智能预审已完成"
            : "待经办"}
        </span>
      </div>
      <div className="operator-layout">
        <section className="facts-panel">
          <h2>业务事实</h2>
          <FactGroup
            title="支付事实"
            rows={[
              ["结算金额", `USD ${state.payment.amount}`, "paymentAmount"],
              ["付款方", state.payment.payer, "payer"],
              ["收款方", state.payment.payee, "payee"],
              ["交易附言", state.payment.narrative, "narrative"],
            ]}
            onSelect={selectFact}
            selected={state.selectedEvidence || ""}
          />
          <FactGroup
            title="贸易事实"
            rows={[
              ["发票金额", `USD ${state.invoice.amount}`, "invoiceAmount"],
              ["买方", state.payment.payer, "buyer"],
              ["出口商", state.payment.payee, "exporter"],
            ]}
            onSelect={selectFact}
            selected={state.selectedEvidence || ""}
          />
          <FactGroup
            title="单据事实"
            rows={[
              ["发票号", state.invoice.number, "invoiceNo"],
              ["数量", state.invoice.quantity, "quantity"],
              ["包装", state.invoice.packages, "packages"],
              ["运输路线", state.invoice.route, "route"],
            ]}
            onSelect={selectFact}
            selected={state.selectedEvidence || ""}
          />
        </section>
        <section className="document-panel">
          <div className="document-tabs">
            {[
              ["pacs008", "模拟 pacs.008"],
              ["invoice", "商业发票"],
              ["packing", "装箱单"],
              ["shipping", "装运通知"],
            ].map(([id, label]) => (
              <button
                className={doc === id ? "selected" : ""}
                onClick={() => {
                  setDoc(id as any);
                  dispatch({ type: "SELECT_DOCUMENT", id: id as any });
                }}
                key={id}
              >
                {label}
              </button>
            ))}
          </div>
          {doc === "pacs008" ? (
            <XmlViewer selected={state.selectedEvidence} />
          ) : (
            <EvidenceImage file={docFile} evidence={evidence?.type === "image" && evidence.documentId === doc ? evidence : undefined} />
          )}
          {evidence && (
            <div className="evidence-pop">
              <b>证据来源</b>
              <span>文件：{evidence.documentId}</span>
              <span>字段：{evidence.label}</span>
              <span>原始文本：{evidence.originalText}</span>
              <span>分析批次：{state.analysisRun || "AnalysisRun V1"}</span>
              <span>状态：已定位</span>
            </div>
          )}
        </section>
      </div>
      <div className="operator-bottom">
        <div>
          <h2>事实关系核验</h2>
          <div className="verification-grid">
            {[
              "支付金额 ↔ 发票金额",
              "付款方 ↔ 买方",
              "收款方 ↔ 出口商",
              "发票 ↔ 装箱单",
              "发票 ↔ 装运通知",
            ].map((x) => (
              <div key={x}>
                <Check size={15} />
                <span>{x}</span>
                <b>信息一致</b>
              </div>
            ))}
          </div>
        </div>
        <div className="action-box">
          <h2>当前处理建议</h2>
          <p>基础事实已完成整理，当前未发现明确字段冲突，进入银行人工经办。</p>
          <div className="action-row">
            <button className="secondary" onClick={onTrust}>
              查看可信判断
            </button>
            <button className="secondary" onClick={onRequest}>
              请求补充材料
            </button>
            <button
              className="primary"
              disabled={state.supplementalTask || state.operatorSubmitted}
              onClick={onSubmit}
            >
              提交复核 <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
function FactGroup({
  title,
  rows,
  onSelect,
  selected,
}: {
  title: string;
  rows: string[][];
  onSelect: (id: string) => void;
  selected: string;
}) {
  return (
    <div className="fact-group">
      <h3>{title}</h3>
      {rows.map(([l, v, id]) => (
        <button
          className={`fact ${selected === id ? "selected" : ""}`}
          onClick={() => onSelect(id)}
          key={id}
        >
          <span>{l}</span>
          <b>{v}</b>
        </button>
      ))}
    </div>
  );
}
function EvidenceImage({file,evidence}:{file:string;evidence?:Extract<Evidence,{type:'image'}>}){const imgRef=useRef<HTMLImageElement>(null);const canvasRef=useRef<HTMLDivElement>(null);const [rect,setRect]=useState({left:0,top:0,width:0,height:0});const measure=()=>{const img=imgRef.current;if(!img||!evidence)return;const r=img.getBoundingClientRect();const sx=r.width/evidence.sourceBox.sourceWidth,sy=r.height/evidence.sourceBox.sourceHeight;setRect({left:evidence.sourceBox.x*sx,top:evidence.sourceBox.y*sy,width:evidence.sourceBox.width*sx,height:evidence.sourceBox.height*sy})};useEffect(()=>{measure();const ro=new ResizeObserver(measure);if(imgRef.current)ro.observe(imgRef.current);return()=>ro.disconnect()},[file,evidence]);useEffect(()=>{if(evidence&&rect.width)document.querySelector('.evidence-box')?.scrollIntoView({behavior:'smooth',block:'center',inline:'center'})},[evidence,rect.width]);return <div className="doc-view image-scroll"><div className="image-canvas" ref={canvasRef}><img ref={imgRef} src={assetUrl(file)} onLoad={measure}/>{evidence&&rect.width>0&&<div className="evidence-box visible" style={{left:rect.left,top:rect.top,width:rect.width,height:rect.height}}/>}</div></div>}
function XmlViewer({ selected }: { selected: string | null }) {const [xml,setXml]=useState('');const refs=useRef<Record<string,HTMLElement|null>>({});useEffect(()=>{fetch(assetUrl('demo/2019/pacs008-demo.xml')).then(r=>r.text()).then(setXml)},[]);const evidence=getEvidence(selected||'');const e=evidence?.type==='xml'?evidence:null;if(!xml)return <pre className="xml-viewer">正在读取模拟 pacs.008…</pre>;const match=e?.matchText||'';return <pre className="xml-viewer">{xml.split('\n').map((line,i)=>{if(!match||!line.includes(match))return <span key={i}>{line}{'\n'}</span>;const parts=line.split(match);return <span key={i}>{parts[0]}<mark ref={node=>{if(e)refs.current[e.id]=node}} className="xml-highlight">{match}</mark>{parts.slice(1).join(match)}{'\n'}</span>})}</pre>}
function TrustModal({
  onClose,
  onConfirm,
  allowed,
  reasons,
}: {
  onClose: () => void;
  onConfirm: () => void;
  allowed: boolean;
  reasons: string[];
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal trust-modal">
        <h2>当前动作可信判断</h2>
        <p>请求动作：提交银行复核</p>
        {[
          "规则条件",
          "当前任务",
          "证据状态",
          "AnalysisRun有效",
          "当前岗位",
          "流程状态",
        ].map((x, i) => (
          <div className="check-line" key={x}>
            <span>{x}</span>
            <b className={allowed || i < 3 ? "ok" : ""}>
              {allowed || i < 3 ? <Check size={14} /> : "—"}{" "}
              {allowed || i < 3 ? "满足" : "待处理"}
            </b>
          </div>
        ))}
        {!allowed && <p className="warn">{reasons.join("、")}</p>}
        <div className={allowed ? "decision-ok" : "decision-block"}>
          {allowed ? "允许执行" : "当前暂不能提交复核"}
        </div>
        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>
            取消
          </button>
          {allowed && (
            <button className="primary" onClick={onConfirm}>
              确认提交复核
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
function Reviewer({ onComplete }: { onComplete: () => void }) {
  const { state } = useDemo();
  return (
    <div className="reviewer-layout">
      <section>
        <h2>经办结论</h2>
        <div className="review-summary">
          <span className="success-icon">
            <Check />
          </span>
          <div>
            <b>经办状态：已完成</b>
            <p>当前待确认：0</p>
            <p>人工意见：当前事实与材料关系已完成基础核验</p>
          </div>
        </div>
        <h2>关键业务事实</h2>
        <div className="key-facts">
          <b>USD {state.invoice.amount}</b>
          <span>{state.payment.payer}</span>
          <span>{state.payment.payee}</span>
          <span>{state.invoice.number}</span>
        </div>
      </section>
      <section>
        <h2>处理轨迹</h2>
        <div className="mini-timeline">
          {[
            "来款接入",
            "企业确认",
            "任务处理",
            "智能预审",
            "银行经办",
            "人工复核",
          ].map((x, i) => (
            <div className={i < 5 ? "done" : ""} key={x}>
              <span>
                <Check size={13} />
              </span>
              {x}
            </div>
          ))}
        </div>
        <button className="primary wide" onClick={onComplete}>
          完成复核并提交后续授权 <ChevronRight size={16} />
        </button>
        <p className="muted">当前操作完成工银智汇通范围内的复核流转。</p>
      </section>
    </div>
  );
}
