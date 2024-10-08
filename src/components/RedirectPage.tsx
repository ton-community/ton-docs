import React, { useEffect } from 'react'

const RedirectPage = ({ redirectUrl}: { redirectUrl: string }) => {
  // redirect here because current version of docusaurus doesn't support redirect for external links
  useEffect(() => {
    window.location.href = redirectUrl;
  }, [])
    
  return (
    <div />
  )
}

export default RedirectPage