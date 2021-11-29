import React, { ReactNode, Dispatch, SetStateAction, MouseEventHandler } from 'react'

export type PersistentModalState = {
  open: boolean
  content: ReactNode
  style?: string
}

export type PersistentModalProps = {
  state: PersistentModalState
  setModalState: Dispatch<SetStateAction<PersistentModalState>>
}

export default function PersistentModal({ state: { open, content, style }, setModalState }: PersistentModalProps) {
  const on_close: MouseEventHandler = e => {
    setModalState({ open: false, content, style })
    e.stopPropagation()
  }

  return (
    <div className={`modal-overlay ${ open ? 'open' : '' } ${ style || '' }`} onClick={ on_close }>
      <div className='modal-container'>
        <div className='modal' onClick={e => e.stopPropagation()}>
          { content }
        </div>
        <a className='back-button' onClick={on_close}>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12' />
          </svg>
        </a>
      </div>
    </div>
  )
}

