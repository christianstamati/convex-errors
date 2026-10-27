// Stands in for the `m` that Paraglide compiles from messages/<locale>.json.
export const m = {
  sign_in: () => "Melde dich zuerst an.",
  not_found: (p: { what: string }) => `${p.what} existiert nicht mehr.`,
  too_many: (p: { what: string; max: number }) => `Du kannst höchstens ${p.max} ${p.what} haben.`,
  file_too_large: (p: { maxMb: number }) => `Dateien dürfen höchstens ${p.maxMb} MB groß sein.`,
  something_went_wrong: () => "Etwas ist schiefgelaufen.",
};
