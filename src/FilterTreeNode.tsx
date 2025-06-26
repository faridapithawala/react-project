import React, { useState } from "react";

const logicOperators = ["AND", "OR"];
const filterFields = ["Status", "Priority", "Assigned To", "Category"];
const fieldOperators = ["equals", "not equals", "contains", "does not contain"];
const fieldValues: any = {
  Status: ["Open", "In Progress", "Closed"],
  Priority: ["Low", "Medium", "High"],
  "Assigned To": ["User A", "User B", "User C"],
  Category: ["Bug", "Feature", "Task"],
};

type Condition = {
  field: string;
  operator: string;
  value: string;
};

type TreeData = {
  logic: string;
  conditions: (Condition | TreeData)[];
};

export default function FilterTree() {
  const [logic, setLogic] = useState("AND");

  const [leftFilter, setLeftFilter] = useState<Condition>({
    field: "",
    operator: "",
    value: "",
  });
  const [rightFilter, setRightFilter] = useState<Condition>({
    field: "",
    operator: "",
    value: "",
  });

  const [treeData, setTreeData] = useState<TreeData>({
    logic: "AND",
    conditions: [],
  });

  const updateTree = (side: "left" | "right", logic: string) => {
    const condition =
      side === "left"
        ? { ...leftFilter }
        : { ...rightFilter };

    if (!condition.field || !condition.operator || !condition.value) return;
    
    setTreeData((prev) => {
      const newConditions = [...prev.conditions];
      if (side === "left") {
        if(newConditions[0]){
            newConditions[0] = {logic: logic, conditions :[newConditions[0], condition ] }
        }
        else newConditions[0] = condition;
      } else if ((side === "right")){
        if(newConditions[1]){
            newConditions[1] = {logic: logic, conditions :[newConditions[1], condition ] }
        }
        else newConditions[1] = condition;
      }
      return { ...prev, logic, conditions: newConditions };
    });


    if (side === "left") {
      setLeftFilter({ field: "", operator: "", value: "" });
    } else {
      setRightFilter({ field: "", operator: "", value: "" });
    }
  };

  return (
    <div>
      <h2>Query Builder</h2>

      <select value={logic} onChange={(e) => {
        setLogic(e.target.value);
        setTreeData((prev) => ({ ...prev, logic: e.target.value }));
      }}>
        {logicOperators.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", gap: "40px", marginTop: 20 }}>
        
        <div>
          <h4>Left Condition</h4>
          <select
            value={leftFilter.field}
            onChange={(e) =>
              setLeftFilter({ ...leftFilter, field: e.target.value, value: "" })
            }
          >
            <option value="">Select Field</option>
            {filterFields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            value={leftFilter.operator}
            onChange={(e) =>
              setLeftFilter({ ...leftFilter, operator: e.target.value })
            }
          >
            <option value="">Select Operator</option>
            {fieldOperators.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>

          <select
            value={leftFilter.value}
            onChange={(e) =>
              setLeftFilter({ ...leftFilter, value: e.target.value })
            }
          >
            <option value="">Select Value</option>
            {(fieldValues[leftFilter.field] || []).map((val: any) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>

          {leftFilter.field && leftFilter.operator && leftFilter.value && (
            <button onClick={() => updateTree("left", logic)}>
              Add Filter on Left
            </button>
          )}
        </div>

       
        <div>
          <h4>Right Condition</h4>
          <select
            value={rightFilter.field}
            onChange={(e) =>
              setRightFilter({
                ...rightFilter,
                field: e.target.value,
                value: "",
              })
            }
          >
            <option value="">Select Field</option>
            {filterFields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            value={rightFilter.operator}
            onChange={(e) =>
              setRightFilter({ ...rightFilter, operator: e.target.value })
            }
          >
            <option value="">Select Operator</option>
            {fieldOperators.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>

          <select
            value={rightFilter.value}
            onChange={(e) =>
              setRightFilter({ ...rightFilter, value: e.target.value })
            }
          >
            <option value="">Select Value</option>
            {(fieldValues[rightFilter.field] || []).map((val: any) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>

          {rightFilter.field &&
            rightFilter.operator &&
            rightFilter.value && (
              <button onClick={() => updateTree("right", logic)}>
                Add Filter on Right
              </button>
            )}
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <pre>{JSON.stringify(treeData, null, 2)}</pre>
      </div>
    </div>
  );
}
