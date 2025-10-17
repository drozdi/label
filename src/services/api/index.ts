import { storeApp } from '../../entites/app/store'
import { api as serverApi } from '../../shared/api/server'

export const api = storeApp.offlineMode ? serverApi : serverApi
