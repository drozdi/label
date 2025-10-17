import { storeApp } from '../../entites/app/store'
import { api as serverApi } from '../../shared/api'

export const api = storeApp.offlineMode ? serverApi : serverApi
