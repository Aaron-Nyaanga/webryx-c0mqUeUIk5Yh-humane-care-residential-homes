import { useEffect } from 'react'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} | Humane Care Residential Homes`
      : 'Humane Care Residential Homes | Group Homes for Adults with Disabilities'
  }, [title])
}
