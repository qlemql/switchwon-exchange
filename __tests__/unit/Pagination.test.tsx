import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/features/history/ui/Pagination';

describe('Pagination', () => {
  it('should render current page and total pages', () => {
    const onPageChange = vi.fn();
    const { container } = render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    expect(container.textContent).toContain('Page');
    expect(container.textContent).toContain('1');
    expect(container.textContent).toContain('10');
  });

  it('should disable Previous button on first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const prevButtons = screen.getAllByRole('button', { name: /Previous/i });
    prevButtons.forEach(button => expect(button).toBeDisabled());
  });

  it('should enable Next button when not on last page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const nextButtons = screen.getAllByRole('button', { name: /Next/i });
    nextButtons.forEach(button => expect(button).not.toBeDisabled());
  });

  it('should disable Next button on last page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={10} totalPages={10} onPageChange={onPageChange} />);

    const nextButtons = screen.getAllByRole('button', { name: /Next/i });
    nextButtons.forEach(button => expect(button).toBeDisabled());
  });

  it('should call onPageChange when clicking Next', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const nextButtons = screen.getAllByRole('button', { name: /Next/i });
    fireEvent.click(nextButtons[0]);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when clicking Previous', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={10} onPageChange={onPageChange} />);

    const prevButtons = screen.getAllByRole('button', { name: /Previous/i });
    fireEvent.click(prevButtons[0]);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should handle single page correctly', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />);

    const prevButtons = screen.getAllByRole('button', { name: /Previous/i });
    const nextButtons = screen.getAllByRole('button', { name: /Next/i });

    prevButtons.forEach(button => expect(button).toBeDisabled());
    nextButtons.forEach(button => expect(button).toBeDisabled());
  });

  it('should display correct page information', () => {
    const onPageChange = vi.fn();
    const { container } = render(<Pagination currentPage={5} totalPages={20} onPageChange={onPageChange} />);

    expect(container.textContent).toContain('Page');
    expect(container.textContent).toContain('5');
    expect(container.textContent).toContain('20');
  });
});
