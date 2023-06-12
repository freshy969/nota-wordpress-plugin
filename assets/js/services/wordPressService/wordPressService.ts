import { WordPressService } from 'assets/js/services/types'
import { findOrCreateTerm } from 'assets/js/services/wordPressService/findOrCreateTerm'
import { editMeta } from 'assets/js/services/wordPressService/editMeta'

export const wordPressService: WordPressService = {
  editMeta,
  findOrCreateTerm,
}
