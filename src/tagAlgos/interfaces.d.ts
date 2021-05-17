export interface Tag {
    name: string
    start: number
    end: number
  }
  
  export interface Match {
    attributeNestingLevel: number
    opening: Tag
    closing: Tag
  }
  
  // Opening/Closing is null = unclosed, but processed
  export interface PartialMatch {
    attributeNestingLevel: number
    opening?: Partial<Tag> | null
    closing?: Tag | null
  }
  