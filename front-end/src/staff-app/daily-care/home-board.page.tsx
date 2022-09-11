import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { ToggleButton } from "staff-app/components/toggle-button/toggle-button.component"
import AppContext from "staff-app/AppContext"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [saveRolls, saveRollResp, loadStateSave] = useApi({ url: "save-roll" })

  const [studentsData, setStudentsData] = useState<Person[]>([])

  const [isAsc, setIsAsc] = useState<boolean>(false)
  const [sortFor, setSortFor] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const { allStudents, updateAllStudents } = useContext(AppContext)

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setSearchTerm("")
      setSortFor("")
      setIsAsc(false)
      setIsRollMode(true)
    }
  }

  // Sort array elements
  const sortByKey = (array: any[] | undefined, key: string) => {
    return array?.sort(function (a: { [x: string]: any }, b: { [x: string]: any }) {
      let x = a[key]
      let y = b[key]
      return x < y ? -1 : x > y ? 1 : 0
    })
  }

  // apply selected filter on remark selected
  const applyFilter = (remark: string) => {
    return allStudents.filter((stud: { remark: string }) => stud?.remark === remark)
  }

  // Save current rolls
  const handleStudentDataSave = () => {
    const student_roll_states = allStudents.map((stud: Person) => {
      return { student_id: [stud.id][0], roll_state: [stud.remark][0] ? [stud.remark][0] : "unmark" }
    })
    void saveRolls({ student_roll_states })
  }

  // handler for roll action - filter/save/close
  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setStudentsData(allStudents)
      setIsRollMode(false)
    } else if (action === "complete") {
      handleStudentDataSave()
      setIsRollMode(false)
    } else if (action === "all") {
      setStudentsData(allStudents)
    } else setStudentsData(applyFilter(action))
  }

  useEffect(() => {
    void getStudents()
  }, [])

  useEffect(() => {
    if (loadState === "loaded" && data && data.students.length > 0) {
      updateAllStudents(data.students)
    }
  }, [loadState])

  useEffect(() => {
    if (allStudents && allStudents.length > 0) setStudentsData(allStudents)
  }, [allStudents])

  // Detect change in Filter/Order/Search Term
  useEffect(() => {
    let temp: any = allStudents
    if (searchTerm.length > 0) {
      const pattern = new RegExp(searchTerm, "i")
      temp = temp.filter((p: Person) => pattern.test(p.first_name))
    }
    if (!sortFor) {
      temp = isAsc ? sortByKey(temp, "id")?.reverse() : sortByKey(temp, "id")
    } else {
      temp = isAsc ? sortByKey(temp, sortFor)?.reverse() : sortByKey(temp, sortFor)
    }
    setStudentsData([...temp])
  }, [isAsc, sortFor, searchTerm])

  // set students back to its all data once rolls saved
  useEffect(() => {
    if (loadStateSave === "loaded") setStudentsData(allStudents)
  }, [loadStateSave])

  return (
    <>
      <S.PageContainer>
        <Toolbar
          onItemClick={onToolbarAction}
          isAsc={isAsc}
          setIsAsc={setIsAsc}
          sortFor={sortFor}
          setSortFor={setSortFor}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isRollMode={isRollMode}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" &&
          studentsData.length > 0 &&
          studentsData.map((s: Person, index: number) => <StudentListTile key={s.id} isRollMode={isRollMode} student={s} index={index} />)}

        {loadState === "loaded" && studentsData.length === 0 && (
          <S.Button
            onClick={() => {
              void getStudents()
            }}
          >
            Reload
          </S.Button>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
            <S.Button
              onClick={() => {
                void getStudents()
              }}
            >
              Reload
            </S.Button>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  setIsAsc: any
  isAsc: boolean
  sortFor: string
  setSortFor: any
  searchTerm: string
  setSearchTerm: any
  isRollMode: boolean
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, isAsc, setIsAsc, sortFor, setSortFor, searchTerm, setSearchTerm, isRollMode } = props
  return (
    <S.ToolbarContainer>
      <ToggleButton isAsc={isAsc} setIsAsc={setIsAsc} sortFor={sortFor} setSortFor={setSortFor} isRollMode={isRollMode} />

      <S.SearchBar type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isRollMode} placeholder="Search Student ...." />

      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,

  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  SearchBar: styled.input`
    padding: 4px;
    border: none;
    flex-grow: 1;
    border-radius: 8px;
    text-align: center;
  `,
}
