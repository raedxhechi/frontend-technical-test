import { fireEvent, render, screen } from '@testing-library/react'
import { MessageComposer } from '../MessageComposer'

const type = (value: string) => {
  fireEvent.change(screen.getByRole('textbox', { name: /Écrivez un message/ }), {
    target: { value },
  })
}

describe('MessageComposer', () => {
  it('should send the trimmed body and clear the field', () => {
    const onSend = jest.fn()
    render(<MessageComposer onSend={onSend} />)

    type('  Bonjour  ')
    fireEvent.click(screen.getByRole('button', { name: /Envoyer/ }))

    expect(onSend).toHaveBeenCalledWith('Bonjour')
    expect(screen.getByRole('textbox', { name: /Écrivez un message/ })).toHaveValue('')
  })

  it('should disable sending while the field is empty', () => {
    render(<MessageComposer onSend={jest.fn()} />)

    expect(screen.getByRole('button', { name: /Envoyer/ })).toBeDisabled()

    type('   ')

    expect(screen.getByRole('button', { name: /Envoyer/ })).toBeDisabled()
  })

  it('should not send a body made only of whitespace', () => {
    const onSend = jest.fn()
    render(<MessageComposer onSend={onSend} />)

    type('   ')
    fireEvent.submit(screen.getByRole('textbox', { name: /Écrivez un message/ }).closest('form') as HTMLFormElement)

    expect(onSend).not.toHaveBeenCalled()
  })

  it('should send on Enter but not on Shift+Enter', () => {
    const onSend = jest.fn()
    render(<MessageComposer onSend={onSend} />)

    const field = screen.getByRole('textbox', { name: /Écrivez un message/ })

    type('Bonjour')
    fireEvent.keyDown(field, { key: 'Enter', shiftKey: true })

    expect(onSend).not.toHaveBeenCalled()

    fireEvent.keyDown(field, { key: 'Enter' })

    expect(onSend).toHaveBeenCalledWith('Bonjour')
  })
})
