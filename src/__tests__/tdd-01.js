import * as React from 'react'
import {render, screen, waitFor} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import {Redirect as mockRedirect} from 'react-router'
// import {build, fake} from 'test-data-bot'
import {Editor} from '../post-editor-01-markup'

import {savePost as mockSavePost} from '../api'

jest.mock('../api')

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})

// const postBuilder = build('Post').fields({
//   title: fake((f) => f.lorem.words()),
//   content: fake((f) => f.lorem.paragraphs().replace(/\r/g, '')),
//   tags: fake((f) => [f.lorem.word(), f.lorem.word()]),
// })

test('renders a form with title, content, tags and submit button', async () => {
  mockSavePost.mockResolvedValueOnce()
  render(<Editor />)
  screen.getByLabelText(/title/i).value = 'Test title'
  screen.getByLabelText(/content/i).value = 'Test content'
  screen.getByLabelText(/tags/i).value = 'tag1, tag2'
  const submitButton = screen.getByText(/submit/i)
  userEvent.click(submitButton)

  expect(submitButton).toBeDisabled()

  expect(mockSavePost).toHaveBeenCalledWith({
    title: 'Test title',
    content: 'Test content',
    tags: 'tag1, tag2',
  })
  expect(mockSavePost).toHaveBeenCalledTimes(1)
  await waitFor(() => expect(mockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
})

test('error response from api', async () => {
  const errorValue = 'Something went wrong'
  mockSavePost.mockRejectedValueOnce({data: {error: errorValue}})
  render(<Editor />)
  const submitButton = screen.getByText(/submit/i)
  userEvent.click(submitButton)

  expect(submitButton).toBeDisabled()
  const postError = await screen.findByRole('alert')
  expect(postError).toHaveTextContent(errorValue)
  expect(submitButton).toBeEnabled()
})
