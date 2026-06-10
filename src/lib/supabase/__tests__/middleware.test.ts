import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

import { createServerClient } from '@supabase/ssr'
import { proxy } from '@/proxy'

function makeRequest(pathname: string) {
  return new NextRequest(new URL(`http://localhost:3000${pathname}`))
}

function mockSupabaseUser(user: object | null) {
  vi.mocked(createServerClient).mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
    cookies: {
      getAll: vi.fn().mockReturnValue([]),
      setAll: vi.fn(),
    },
  } as unknown as ReturnType<typeof createServerClient>)
}

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects unauthenticated users from protected routes to /login', async () => {
    mockSupabaseUser(null)
    const request = makeRequest('/dashboard')
    const response = await proxy(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/login')
  })

  it('allows unauthenticated users to access /login', async () => {
    mockSupabaseUser(null)
    const request = makeRequest('/login')
    const response = await proxy(request)
    expect(response.status).not.toBe(307)
  })

  it('allows unauthenticated users to access /invite routes', async () => {
    mockSupabaseUser(null)
    const request = makeRequest('/invite/abc123')
    const response = await proxy(request)
    expect(response.status).not.toBe(307)
  })

  it('redirects authenticated users from / to /dashboard', async () => {
    mockSupabaseUser({ id: 'user-1', email: 'test@example.com' })
    const request = makeRequest('/')
    const response = await proxy(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/dashboard')
  })

  it('allows authenticated users to access /dashboard', async () => {
    mockSupabaseUser({ id: 'user-1', email: 'test@example.com' })
    const request = makeRequest('/dashboard')
    const response = await proxy(request)
    expect(response.status).not.toBe(307)
  })
})
