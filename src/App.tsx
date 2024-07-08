import { useEffect, useState } from "react";
import "./App.css";
import { IBox } from "./interface";
const App = () => {
    const [value, setValue] = useState<number>(0);
    const [listBox, setListBox] = useState<IBox[][]>([]);
    const [isPlayA, setIsPlayA] = useState<boolean>(true);
    const [listPlayACheck, setListPlayACheck] = useState<IBox[]>([]);
    const [listPlayBCheck, setListPlayBCheck] = useState<IBox[]>([]);
    const [playWin, setPlaywin] = useState<number>(0);
    const [listEnd, setListEnd] = useState<IBox[]>([]);
    const [typeLine, setTypeLine] = useState<number>(0);

    const handleCreate = () => {
        if (!value) {
            return;
        }

        const listAll: IBox[][] = [];

        for (let i = 0; i < value; i++) {
            const listRow: IBox[] = [];
            for (let j = 0; j < value; j++) {
                const box: IBox = {
                    row: i,
                    col: j,
                    isCheck: false,
                    play: "",
                };
                listRow.push(box);
            }

            listAll.push(listRow);
        }

        setListBox(listAll);
    };

    const handleREset = () => {
        // setListBox([]);
        setIsPlayA(true);
        setListPlayACheck([]);
        setListPlayBCheck([]);
        setPlaywin(0);
        setTypeLine(0);
        setListEnd([]);
    };

    const handleValidate = (itemChild: IBox) => {
        let isValid = true;
        listPlayACheck.forEach((item) => {
            if (item.col === itemChild.col && item.row === itemChild.row) {
                isValid = false;
            }
        });

        listPlayBCheck.forEach((item) => {
            if (item.col === itemChild.col && item.row === itemChild.row) {
                isValid = false;
            }
        });
        return isValid;
    };

    const handleCheck = (itemChild: IBox) => {
        const check = handleValidate(itemChild);

        if (!check) {
            return;
        }

        const namePlayer = isPlayA ? "x" : "o";
        const box: IBox = { ...itemChild, isCheck: true, play: namePlayer };
        if (isPlayA) {
            setListPlayACheck((prev) => [...prev, box]);
        } else {
            setListPlayBCheck((prev) => [...prev, box]);
        }
        setIsPlayA(!isPlayA);
    };

    const handleCheckCungHang = (type: boolean, isRow: boolean) => {
        let isReturn = false;
        const array = type ? [...listPlayACheck] : [...listPlayBCheck];

        for (let i = 0; i < value; i++) {
            const arrFilter = array.filter((item) =>
                isRow ? item.row === i : item.col === i
            );

            if (arrFilter.length >= 5) {
                const arrSort = arrFilter.sort((itemOne, itemTwo) => {
                    return isRow
                        ? itemOne.col - itemTwo.col
                        : itemOne.row - itemTwo.row;
                });

                let count = 0;
                const arrLine = [];

                for (let i = 0; i < arrSort.length - 1; i++) {
                    if (
                        (isRow && arrSort[i].col === arrSort[i + 1].col - 1) ||
                        (!isRow && arrSort[i].row === arrSort[i + 1].row - 1)
                    ) {
                        arrLine.push(arrSort[i]);
                        if (arrLine.length === 4) {
                            arrLine.push(arrSort[i + 1]);
                        }
                        count++;
                    } else {
                        count = 0;
                    }
                }

                if (count >= 4) {
                    setPlaywin(type ? 1 : 2);
                    setListEnd(arrLine);
                    setTypeLine(isRow ? 1 : 2);
                    isReturn = true;
                    return;
                }
            }
        }

        return isReturn;
    };

    const handleFind = (arr: IBox[], data: IBox, isCong: boolean) => {
        return arr.find((item) =>
            isCong
                ? item.col === data.col + 1 && item.row === data.row + 1
                : item.col === data.col - 1 && item.row === data.row + 1
        );
    };

    const handleCheckDuongCheo = (type: boolean) => {
        let isReturn = false;
        const arr = type ? [...listPlayACheck] : [...listPlayBCheck];
        if (arr.length < 5) {
            return true;
        }

        for (let i = 0; i < arr.length; i++) {
            const one = handleFind(arr, arr[i], true);

            if (one) {
                const two = handleFind(arr, one, true);
                if (two) {
                    const three = handleFind(arr, two, true);

                    if (three) {
                        const four = handleFind(arr, three, true);
                        if (four) {
                            setPlaywin(isPlayA ? 2 : 1);
                            isReturn = true;
                            setListEnd([arr[i], one, two, three, four]);
                            setTypeLine(3);
                            break;
                        }
                    }
                }
            }
        }

        return isReturn;
    };

    const handleCheckDuongCheoHai = (type: boolean) => {
        let isReturn = false;
        const arr = type ? [...listPlayACheck] : [...listPlayBCheck];
        if (arr.length < 5) {
            return true;
        }

        for (let i = 0; i < arr.length; i++) {
            const one = handleFind(arr, arr[i], false);

            if (one) {
                const two = handleFind(arr, one, false);
                if (two) {
                    const three = handleFind(arr, two, false);

                    if (three) {
                        const four = handleFind(arr, three, false);
                        if (four) {
                            setPlaywin(isPlayA ? 2 : 1);
                            isReturn = true;
                            setListEnd([arr[i], one, two, three, four]);
                            setTypeLine(4);
                            break;
                        }
                    }
                }
            }
        }

        return isReturn;
    };

    useEffect(() => {
        // if (listPlayACheck.length < 5 && listPlayBCheck.length < 5) {
        //     return;
        // }

        const checkRowA = handleCheckCungHang(true, true);
        if (checkRowA) {
            return;
        }
        const checkRouwB = handleCheckCungHang(false, true);
        if (checkRouwB) {
            return;
        }

        const checkColA = handleCheckCungHang(true, false);
        if (checkColA) {
            return;
        }

        const checkColB = handleCheckCungHang(false, false);
        if (checkColB) {
            return;
        }

        const checkCheoA = handleCheckDuongCheo(true);
        if (checkCheoA) {
            return;
        }

        const checkCheoB = handleCheckDuongCheo(false);
        if (checkCheoB) {
            return;
        }

        //
        const checkCheoHaiA = handleCheckDuongCheoHai(true);
        if (checkCheoHaiA) {
            return;
        }

        const checkCheoHaiB = handleCheckDuongCheoHai(false);
        if (checkCheoHaiB) {
            return;
        }
    }, [isPlayA]);

    return (
        <div className="main">
            <h4>Cờ CARO</h4>

            <div className="detail">
                <p>
                    Play A :{" "}
                    <span className="x">
                        <i className="bi bi-x-lg"></i>
                    </span>
                </p>
                <p>
                    Play B :{" "}
                    <span className="o">
                        <i className="bi bi-circle"></i>
                    </span>
                </p>
            </div>

            <div className="form-control">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(+e.target.value)}
                />

                <button onClick={() => handleCreate()} className="btn-create">
                    Tạo
                </button>
                <button onClick={() => handleREset()} className="btn-reset">
                    reset
                </button>
            </div>

            <div className="form-play">
                {listBox &&
                    listBox.length > 0 &&
                    listBox.map((item, index) => {
                        return (
                            <div className="row" key={index}>
                                {item &&
                                    item.length > 0 &&
                                    item.map((itemChild, indexChild) => {
                                        return (
                                            <div
                                                className="box"
                                                key={indexChild}
                                                onClick={() =>
                                                    playWin
                                                        ? null
                                                        : handleCheck(itemChild)
                                                }
                                            >
                                                <p>
                                                    {listPlayACheck.find(
                                                        (playA) =>
                                                            playA.col ===
                                                                itemChild.col &&
                                                            playA.row ===
                                                                itemChild.row
                                                    ) ? (
                                                        <span className="x">
                                                            <i className="bi bi-x-lg"></i>
                                                        </span>
                                                    ) : listPlayBCheck.find(
                                                          (playB) =>
                                                              playB.col ===
                                                                  itemChild.col &&
                                                              playB.row ===
                                                                  itemChild.row
                                                      ) ? (
                                                        <span className="o">
                                                            <i className="bi bi-circle"></i>
                                                        </span>
                                                    ) : (
                                                        ""
                                                    )}
                                                </p>

                                                {listEnd.find(
                                                    (itemLine) =>
                                                        itemLine.col ===
                                                            itemChild.col &&
                                                        itemLine.row ===
                                                            itemChild.row
                                                ) ? (
                                                    <div
                                                        className={`${
                                                            typeLine === 1
                                                                ? "line-row"
                                                                : typeLine === 2
                                                                ? "line-col"
                                                                : typeLine === 3
                                                                ? "line-cheo1"
                                                                : "line-cheo2"
                                                        }`}
                                                    ></div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default App;
