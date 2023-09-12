import { CatalogContent } from '@/components/catalog-content/catalog-content'
import { Header } from '@/components/header/header'
import { FC } from 'react'

const CatalogPage: FC = () => {
  return (
    <>
      <Header />
      <CatalogContent />
    </>
  )
}

export default CatalogPage
