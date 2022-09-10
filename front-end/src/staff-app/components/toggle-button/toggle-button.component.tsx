import React from "react"
import styled from "styled-components"

interface Props {
  isAsc: boolean
  setIsAsc: any
  sortFor: string
  setSortFor: any
  isRollMode: boolean
}

export const ToggleButton: React.FC<Props> = ({ isAsc, setIsAsc, sortFor, setSortFor, isRollMode }) => {
  return (
    <Container>
      <CheckBoxWrapper>
        <CheckBox
          id="checkbox"
          type="checkbox"
          onChange={(e) => {
            setIsAsc(e.target.checked)
          }}
          checked={isAsc}
          disabled={isRollMode}
        />
        <CheckBoxLabel htmlFor="checkbox" />
      </CheckBoxWrapper>

      <select
        name="filter"
        value={sortFor}
        onChange={(e) => {
          setSortFor(e.target.value)
        }}
        disabled={isRollMode}
      >
        <option value="">Filter</option>
        <option value="first_name">First Name</option>
        <option value="last_name">Last Name</option>
      </select>
    </Container>
  )
}

const Container = styled.div`
  padding: 0 8px;
  color: #000;
`
const CheckBoxWrapper = styled.div`
  position: relative;
  margin: 0;
  display: block;
`
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 87px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  margin: 2px 1px;
  padding: 0;
  cursor: pointer;
  &::after {
    content: "Asc";
    display: block;
    border-radius: 15px;
    text-align: center;
    width: 40px;
    margin-top: 4px;
    margin-left: 5px;
    height: 18px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 80px;
  height: 26px;
  margin: 0;
  padding: 0;
  &:checked + ${CheckBoxLabel} {
    background: #4fbe79;
    &::after {
      content: "Dsc";
      display: block;
      border-radius: 15px;
      width: 40px;
      height: 18px;
      margin-left: 40px;
      transition: 0.2s;
    }
  }
`
