import axios from 'axios'
import {
  FetchError,
  FetchResponse,
  RequestOptions,
} from 'assets/js/utils/fetch/types'

function get<T>(url: string, options?: RequestOptions) {
  return request<T>('GET', url, options)
}
function post<T>(url: string, options?: RequestOptions) {
  return request<T>('POST', url, options)
}

function patch<T>(url: string, options?: RequestOptions) {
  return request<T>('PATCH', url, options)
}

function put<T>(url: string, options?: RequestOptions) {
  return request<T>('PUT', url, options)
}

function doDelete<T>(url: string, options?: RequestOptions) {
  return request<T>('DELETE', url, options)
}

async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  url: string,
  options?: RequestOptions,
): Promise<FetchResponse<T>> {
  try {
    const response = await axios.request({
      baseURL: options?.baseUrl,
      url,
      method,
      ...options,
    })
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    }
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status) {
      throw new FetchError(e.response?.status, e.message, e.response.data)
    }
    throw e
  }
}

export default {
  get,
  post,
  patch,
  put,
  doDelete,
}
