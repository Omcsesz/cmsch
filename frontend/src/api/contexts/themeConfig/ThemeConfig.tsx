import { ChakraProvider, useColorMode } from '@chakra-ui/react'
import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { Style } from '../config/types.ts'
import { getCustomTheme } from '../../../util/configs/theme.config.ts'
import { getPersistentStyle, PersistentStyleSettingContext, savePersistentStyle } from '../../../util/configs/themeStyle.config.ts'

const ColorModeSetter = ({ children, style }: PropsWithChildren & { style?: Style }) => {
  const { colorMode, setColorMode } = useColorMode()
  useEffect(() => {
    if (!setColorMode) return
    if (!style) return
    if (colorMode !== 'dark' && style.forceDarkMode) {
      setColorMode('dark')
    } else if (!style.darkModeEnabled) setColorMode('white')
  }, [!!setColorMode, !!style, style?.deviceTheme, style?.forceDarkMode])

  return <>{children}</>
}

export const ThemeConfig = ({ children }: PropsWithChildren) => {
  const [persistentStyle, setPersistentStyle] = useState<Style | undefined>(getPersistentStyle())

  const theme = useMemo(() => getCustomTheme(persistentStyle), [persistentStyle])
  const contextData = useMemo(
    () => ({
      persistentStyle,
      setPersistentStyle: (style?: Style) => {
        savePersistentStyle(style)
        setPersistentStyle(style)
      }
    }),
    [persistentStyle]
  )

  return (
    <PersistentStyleSettingContext.Provider value={contextData}>
      <ChakraProvider theme={theme}>
        <ColorModeSetter style={persistentStyle}>{children}</ColorModeSetter>
      </ChakraProvider>
    </PersistentStyleSettingContext.Provider>
  )
}
