import { WordPressService } from 'assets/js/services/types'
import { findOrCreateTerm } from 'assets/js/services/wordPressService/findOrCreateTerm'

export const wordPressService: WordPressService = {
  findOrCreateTerm,
}
