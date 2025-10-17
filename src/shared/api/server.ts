import { storeApp } from '../../entites/app/store'
import { api as serverApi } from './server'

export const api = storeApp.offlineMode ? serverApi : serverApi
