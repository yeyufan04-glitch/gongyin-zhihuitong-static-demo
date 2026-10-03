import {
  DemoCase,
  initialCase,
  MaterialStatus,
  WorkflowState,
  PrecheckStage,
} from "../data/case2019";
export type Action =
  | { type: "RESET" }
  | { type: "LOAD_CAPTURE"; state: Partial<DemoCase> }
  | {
      type: "SET_WORKFLOW";
      state: WorkflowState;
      event?: { title: string; detail: string };
    }
  | { type: "MATERIAL"; id: string; status: MaterialStatus }
  | { type: "LINK_HISTORY" }
  | { type: "SET_PRECHECK_STAGE"; stage: PrecheckStage; event?: string }
  | { type: "RUN_PRECHECK" }
  | { type: "SUBMIT_OPERATOR" }
  | { type: "COMPLETE_REVIEW" }
  | { type: "REQUEST_SUPPLEMENT" }
  | { type: "COMPLETE_SUPPLEMENT" }
  | { type: "SELECT_EVIDENCE"; id: string }
  | {
      type: "SELECT_DOCUMENT";
      id: "pacs008" | "invoice" | "packing" | "shipping";
    };
const now = () => new Date().toLocaleTimeString("zh-CN", { hour12: false });
const event = (title: string, detail: string) => ({
  id: `e-${Date.now()}`,
  title,
  detail,
  status: "完成" as const,
  time: now(),
});
export function reducer(s: DemoCase, a: Action): DemoCase {
  switch (a.type) {
    case "RESET":
      return initialCase;
    case "LOAD_CAPTURE":
      return { ...initialCase, ...a.state };
    case "SET_WORKFLOW":
      return {
        ...s,
        workflow: a.state,
        runtimeEvents: a.event
          ? [...s.runtimeEvents, event(a.event.title, a.event.detail)]
          : s.runtimeEvents,
      };
    case "MATERIAL":
      return {
        ...s,
        materials: s.materials.map((m) =>
          m.id === a.id ? { ...m, status: a.status } : m,
        ),
      };
    case "LINK_HISTORY":
      return {
        ...s,
        materialReference: true,
        materialReferenceDetail: {
          materialId: "enterprise-profile-v3",
          version: "V3",
          fingerprint: "a84c…39ef",
          linkedCaseId: s.caseId,
        },
        runtimeEvents: [
          ...s.runtimeEvents,
          event("历史材料已关联", "演示历史档案已关联至本笔业务"),
        ],
      };
    case "SET_PRECHECK_STAGE":
      return {
        ...s,
        precheckStage: a.stage,
        runtimeEvents: a.event
          ? [...s.runtimeEvents, event(a.event, "公开技术运行回放")]
          : s.runtimeEvents,
      };
    case "RUN_PRECHECK":
      return {
        ...s,
        workflow: "PRECHECK_COMPLETED",
        precheckStage: "COMPLETED",
        analysisRun: "AnalysisRun V1",
        runtimeEvents: [
          ...s.runtimeEvents,
          event("智能预审完成", "业务事实、证据定位与跨源关系核验已形成"),
        ],
      };
    case "SUBMIT_OPERATOR":
      return {
        ...s,
        workflow: "WAITING_REVIEWER",
        operatorSubmitted: true,
        runtimeEvents: [
          ...s.runtimeEvents,
          event("银行经办完成", "经办结果已提交人工复核"),
        ],
      };
    case "COMPLETE_REVIEW":
      return {
        ...s,
        workflow: "READY_FOR_AUTHORIZATION",
        reviewerCompleted: true,
        runtimeEvents: [
          ...s.runtimeEvents,
          event("后续授权准备", "已完成本平台范围内人工复核流转"),
        ],
      };
    case "REQUEST_SUPPLEMENT":
      return {
        ...s,
        workflow: "WAITING_SUPPLEMENT",
        supplementalTask: true,
        runtimeEvents: [
          ...s.runtimeEvents,
          event("银行补充任务创建", "交易关系说明已返回企业端"),
        ],
      };
    case "COMPLETE_SUPPLEMENT":
      return {
        ...s,
        workflow: "PRECHECK_COMPLETED",
        supplementalTask: false,
        supplementalCompleted: true,
        runtimeEvents: [
          ...s.runtimeEvents,
          event("企业补充任务完成", "交易关系说明已提交银行"),
        ],
      };
    case "SELECT_EVIDENCE":
      return {
        ...s,
        selectedEvidence: a.id,
        selectedDocument:
          a.id === "payer" ||
          a.id === "payee" ||
          a.id === "paymentAmount" ||
          a.id === "narrative"
            ? "pacs008"
            : a.id === "quantity" || a.id === "packages"
              ? "packing"
              : a.id === "route"
                ? "shipping"
                : "invoice",
      };
    case "SELECT_DOCUMENT":
      return { ...s, selectedDocument: a.id };
  }
}
