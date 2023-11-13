import * as React from 'react'
import {Redirect} from 'react-router'
import {savePost} from './api'

function Editor() {
  const [isSaving, setIsSaving] = React.useState(false)
  const [redirect, setIsRedirect] = React.useState(false)
  const [error, setError] = React.useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const {title, content, tags} = e.target.elements
    const newPost = {
      title: title.value,
      content: content.value,
      tags: tags.value,
    }
    setIsSaving(true)
    savePost(newPost).then(
      () => setIsRedirect(true),
      (res) => {
        setIsSaving(false)
        setError(res.data.error)
      },
    )
  }

  if (redirect) {
    return <Redirect to="/" />
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-inp">Title</label>
      <input id="title-inp" name="title" />

      <label htmlFor="content-inp">Content</label>
      <input id="content-inp" name="content" />

      <label htmlFor="tags-inp">Tags</label>
      <input id="tags-inp" name="tags" />

      <button type="submit" disabled={isSaving}>
        Submit
      </button>
      {error ? <div role="alert">{error}</div> : null}
    </form>
  )
}

export {Editor}
