import { describe, expect, it } from "vitest";
import { isValidRut, normalizeRut } from "../../domain/guards/rut";

describe("RUT chileno", () => {
  it("normaliza separadores y mayúsculas", () => {
    expect(normalizeRut("10.511.084-k")).toBe("10511084K");
  });

  it.each(["10.511.084-7", "10511084-7", "105110847"])(
    "acepta el RUT válido %s",
    (rut) => {
      expect(isValidRut(rut)).toBe(true);
    },
  );

  it.each(["10.511.084-8", "1234567-0", ""])(
    "rechaza el RUT inválido %s",
    (rut) => {
      expect(isValidRut(rut)).toBe(false);
    },
  );
});
