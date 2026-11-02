export const NAV_ITEMS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
] as const

export const CONTACT_ITEM = { id: 'contact', label: 'Contact' } as const

/** Sections the header tracks while scrolling; the hero is 'top'. */
export const SECTION_IDS = ['top', ...NAV_ITEMS.map((item) => item.id), CONTACT_ITEM.id]
