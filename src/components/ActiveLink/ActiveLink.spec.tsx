import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter(){
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink component', () => {

  it('rendres correctly', () => {
    render(
      <ActiveLink legacyBehavior href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('adds acitve class if the link as currently active', () => {
    render(
      <ActiveLink legacyBehavior href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )

    expect(screen.getByText('Home')).toHaveClass('active')
  })
})