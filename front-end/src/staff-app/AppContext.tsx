import React, { createContext, useState, useEffect } from "react"
import { Person } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"

type ItemType = RolllStateType | "all"
interface StateList {
  type: ItemType
  count: number
}

const AppContext = createContext({
  allStudents: [],
  attendence: [
    { type: "all", count: 0 },
    { type: "present", count: 0 },
    { type: "late", count: 0 },
    { type: "absent", count: 0 },
  ],
  updateAllStudents: (data: Person[]) => {},
  updateOneStudent: (student: Person, index: number) => {},
  filterTerm: "",
})

export const AppProvider: React.FC = ({ children }) => {
  const [allStudents, setAllStudents] = useState<Person[]>([])
  const [attendence, setAttendence] = useState<StateList[]>([
    { type: "all", count: 0 },
    { type: "present", count: 0 },
    { type: "late", count: 0 },
    { type: "absent", count: 0 },
  ])

  const updateAllStudents = (data: Person[]) => {
    setAllStudents(data)
  }

  const updateOneStudent = (student: Person, index: number) => {
    let temp = [...allStudents]
    temp[index] = student
    setAllStudents(temp)
  }

  const updateAttendance = () => {
    let present = 0
    let late = 0
    let absent = 0

    allStudents.forEach((s) => {
      if (s.remark) {
        switch (s.remark) {
          case "present":
            present++
            break
          case "late":
            late++
            break
          case "absent":
            absent++
            break
          default:
            break
        }
      }
    })

    setAttendence([
      { type: "all", count: allStudents.length },
      { type: "present", count: present },
      { type: "late", count: late },
      { type: "absent", count: absent },
    ])
  }

  useEffect(() => {
    if (allStudents.length > 0) updateAttendance()
  }, [allStudents])

  return <AppContext.Provider value={{ allStudents, attendence, updateAllStudents, updateOneStudent }}>{children}</AppContext.Provider>
}

export default AppContext
