import { describe, it, expect } from "vitest";
import { CUSTOMER_MILESTONES, toCustomerMilestone } from "../projection";

describe("customer projection", () => {
  it("collapses the 7 states onto the 5-milestone view", () => {
    expect(toCustomerMilestone.recibido).toBe("recepcion");
    expect(toCustomerMilestone.diagnostico).toBe("diagnostico");
    expect(toCustomerMilestone.presupuesto).toBe("presupuesto");
    expect(toCustomerMilestone.aprobado).toBe("presupuesto");
    expect(toCustomerMilestone.reparacion).toBe("reparacion");
    expect(toCustomerMilestone.listo).toBe("reparacion");
    expect(toCustomerMilestone.entregado).toBe("entrega");
  });

  it("exposes exactly 5 milestones", () => {
    expect(CUSTOMER_MILESTONES).toEqual([
      "recepcion", "diagnostico", "presupuesto", "reparacion", "entrega",
    ]);
  });
});
