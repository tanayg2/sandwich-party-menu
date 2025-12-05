"use server"

type AirtableRecord = {
  id: string
  fields: Record<string, unknown>
}

export type GuestData = {
  recordId: string
  selectedEntree: string
  modifications: string
  dietaryRestrictions: string
}

const API_ROOT = "https://api.airtable.com/v0"
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY

const FIELD_NAMES = {
  guestName: process.env.AIRTABLE_NAME_FIELD ?? "Name",
  selectedEntree: process.env.AIRTABLE_ENTREE_FIELD ?? "Entree Choice",
  modifications: process.env.AIRTABLE_MODS_FIELD ?? "Entree Modifications",
  dietaryRestrictions:
    process.env.AIRTABLE_DIETARY_FIELD ?? "Dietary Restrictions",
}

function ensureEnv(variable: string | undefined, label: string) {
  if (!variable) {
    throw new Error(
      `${label} is not configured. Please set the corresponding environment variable.`,
    )
  }
  return variable
}

function buildHeaders() {
  return {
    Authorization: `Bearer ${ensureEnv(AIRTABLE_API_KEY, "Airtable API key")}`,
    "Content-Type": "application/json",
  }
}

function escapeFormulaValue(value: string) {
  return value.replace(/'/g, "\\'")
}

async function findGuestRecordByName(
  name: string,
): Promise<AirtableRecord | null> {
  const baseId = ensureEnv(AIRTABLE_BASE_ID, "Airtable Base ID")
  const tableId = ensureEnv(AIRTABLE_TABLE_ID, "Airtable Table ID")

  const params = new URLSearchParams({
    maxRecords: "1",
    filterByFormula: `{${FIELD_NAMES.guestName}} = '${escapeFormulaValue(
      name,
    )}'`,
  })

  const response = await fetch(
    `${API_ROOT}/${baseId}/${encodeURIComponent(tableId)}?${params.toString()}`,
    { headers: buildHeaders(), cache: "no-store" },
  )

  if (!response.ok) {
    throw new Error(`Failed to query Airtable (${response.status})`)
  }

  const data = (await response.json()) as { records?: AirtableRecord[] }
  return data.records?.[0] ?? null
}

export async function fetchGuestData(name: string) {
  try {
    const record = await findGuestRecordByName(name.trim())

    if (!record) {
      return {
        success: false,
        data: null,
        error: "Guest not found",
      }
    }

    const fields = record.fields ?? {}
    const data: GuestData = {
      recordId: record.id,
      selectedEntree:
        (fields[FIELD_NAMES.selectedEntree] as string | undefined) ?? "",
      modifications:
        (fields[FIELD_NAMES.modifications] as string | undefined) ?? "",
      dietaryRestrictions:
        (fields[FIELD_NAMES.dietaryRestrictions] as string | undefined) ?? "",
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function submitMenuData(formData: {
  guestName: string
  selectedEntree: string
  modifications: string
  dietaryRestrictions: string
}) {
  try {
    const guestName = formData.guestName.trim()
    if (!guestName) {
      throw new Error("Guest name is required")
    }
    if (!formData.selectedEntree) {
      throw new Error("Please select an entrée before submitting.")
    }

    const baseId = ensureEnv(AIRTABLE_BASE_ID, "Airtable Base ID")
    const tableId = ensureEnv(AIRTABLE_TABLE_ID, "Airtable Table ID")
    const headers = buildHeaders()

    const existingRecord = await findGuestRecordByName(guestName)

    const payload = {
      fields: {
        [FIELD_NAMES.guestName]: guestName,
        [FIELD_NAMES.selectedEntree]: formData.selectedEntree,
        [FIELD_NAMES.modifications]: formData.modifications ?? "",
        [FIELD_NAMES.dietaryRestrictions]: formData.dietaryRestrictions ?? "",
      },
    }

    let response: Response

    if (existingRecord) {
      response = await fetch(
        `${API_ROOT}/${baseId}/${encodeURIComponent(tableId)}/${
          existingRecord.id
        }`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(payload),
        },
      )
    } else {
      response = await fetch(
        `${API_ROOT}/${baseId}/${encodeURIComponent(tableId)}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        },
      )
    }

    if (!response.ok) {
      const message = await response.text()
      throw new Error(
        `Failed to submit menu data (${response.status}): ${
          message || "Unknown error"
        }`,
      )
    }

    const savedRecord = (await response.json()) as AirtableRecord

    return { success: true, data: savedRecord }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
