import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ShopProvider, useShop } from '@/context/shop-context'
import type { ShopContext } from '@/types/app.types'

const mockShop = {
  id: 'shop-123',
  name: 'อู่ทดสอบ',
  slug: 'test-shop',
  address: null,
  phone: null,
  tax_id: null,
  logo_url: null,
  vat_rate: 0.07,
  settings: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  deleted_at: null,
}

const mockProfile = {
  id: 'user-1',
  shop_id: 'shop-123',
  role: 'owner' as const,
  display_name: 'เจ้าของ',
  phone: null,
  avatar_color: '#0066ff',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockContext: ShopContext = {
  shopId: 'shop-123',
  shop: mockShop,
  profile: mockProfile,
  role: 'owner',
}

function TestConsumer() {
  const { role, shopId, shop, profile } = useShop()
  return (
    <div>
      <span data-testid="role">{role}</span>
      <span data-testid="shopId">{shopId}</span>
      <span data-testid="shopName">{shop.name}</span>
      <span data-testid="displayName">{profile.display_name}</span>
    </div>
  )
}

describe('ShopContext', () => {
  it('provides shopId, role, shop, and profile to consumers', () => {
    render(
      <ShopProvider value={mockContext}>
        <TestConsumer />
      </ShopProvider>
    )
    expect(screen.getByTestId('role').textContent).toBe('owner')
    expect(screen.getByTestId('shopId').textContent).toBe('shop-123')
    expect(screen.getByTestId('shopName').textContent).toBe('อู่ทดสอบ')
    expect(screen.getByTestId('displayName').textContent).toBe('เจ้าของ')
  })

  it('throws when useShop is called outside ShopProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow('useShop must be used within ShopProvider')
    consoleSpy.mockRestore()
  })
})
