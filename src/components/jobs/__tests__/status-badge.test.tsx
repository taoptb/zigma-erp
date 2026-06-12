import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/components/jobs/status-badge'

describe('StatusBadge', () => {
  it('renders Thai label for in_progress', () => {
    render(<StatusBadge status="in_progress" />)
    expect(screen.getByText('กำลังซ่อม')).toBeInTheDocument()
  })

  it('renders Thai label for done_waiting', () => {
    render(<StatusBadge status="done_waiting" />)
    expect(screen.getByText('เสร็จ รอส่งรถ')).toBeInTheDocument()
  })

  it('applies the correct color class for cancelled', () => {
    const { container } = render(<StatusBadge status="cancelled" />)
    expect(container.firstChild).toHaveClass('bg-red-100')
  })
})
