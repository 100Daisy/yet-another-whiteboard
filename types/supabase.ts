export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      SharedWhiteboards: {
        Row: {
          id: number
          userId: string | null
          whiteboardId: number | null
        }
        Insert: {
          id?: number
          userId?: string | null
          whiteboardId?: number | null
        }
        Update: {
          id?: number
          userId?: string | null
          whiteboardId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "SharedWhiteboards_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SharedWhiteboards_whiteboardId_fkey"
            columns: ["whiteboardId"]
            referencedRelation: "Whiteboards"
            referencedColumns: ["id"]
          }
        ]
      }
      UserPreferences: {
        Row: {
          id: string
          title: string | null
        }
        Insert: {
          id: string
          title?: string | null
        }
        Update: {
          id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "UserPreferences_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      Whiteboards: {
        Row: {
          content: string | null
          id: number
          isShared: boolean | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          id?: number
          isShared?: boolean | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          id?: number
          isShared?: boolean | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Whiteboards_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
