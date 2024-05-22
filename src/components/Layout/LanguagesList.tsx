import { Button, Icon, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FaGlobeAmericas } from 'react-icons/fa'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'
import langs, { LanguagesSlice } from '~i18n/languages.mjs'

export const LanguagesList = ({ closeOnSelect }: { closeOnSelect: boolean }) => {
  const { i18n } = useTranslation()

  const languages = LanguagesSlice as { [key: string]: string }

  const isAnyLanguageSelected = Object.keys(languages).some((l) => l === i18n.language) && langs.includes(i18n.language)

  return (
    <>
      {langs.map((k: string) => (
        <MenuItem
          key={k}
          onClick={() => {
            i18n.changeLanguage(k)
          }}
          closeOnSelect={closeOnSelect}
          w='full'
          display='flex'
          justifyContent={closeOnSelect ? 'center' : 'start'}
          fontWeight={k === i18n.language || (k === langs[0] && !isAnyLanguageSelected) ? 'extrabold' : ''}
          borderRadius='none'
        >
          {k.toUpperCase()}
        </MenuItem>
      ))}
    </>
  )
}

export const LanguagesMenu = () => {
  const { t } = useTranslation()

  if (langs.length <= 1) return null

  return (
    <Menu>
      {({ isOpen, onClose }) => (
        <>
          <MenuButton
            as={Button}
            aria-label={t('menu.burger_aria_label')}
            variant='rounded-ghost'
            // sx={{ span: { margin: 'px' } }}
            pr={0}
            rightIcon={
              isOpen ? <Icon ml={1} as={FaChevronUp} boxSize={3} /> : <Icon ml={1} as={FaChevronDown} boxSize={3} />
            }
            minW='none'
          >
            <FaGlobeAmericas />
          </MenuButton>
          <MenuList minW={16} mt={2}>
            <LanguagesList closeOnSelect={true} />
          </MenuList>
        </>
      )}
    </Menu>
  )
}
