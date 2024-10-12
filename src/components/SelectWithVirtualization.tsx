import React from "react";
import Select from "react-select";
import { FixedSizeList as List } from "react-window";

interface SelectWithVirtualizationProps {
    options: { value: any; label: string }[];
    value: { value: any; label: string } | null;
    onChange: (selectedOption: { value: any; label: string } | null) => void;
    }

    const MenuList = (props: any) => {
    const height = 45; // Altura de cada opción
    const itemCount = props.children.length; // Número total de opciones
    const itemSize = height; // Altura de cada opción

    // Asegúrate de que itemCount y height sean válidos
    const validItemCount = isNaN(itemCount) ? 0 : itemCount;
    const validHeight = isNaN(height) ? 0 : height;
    const visibleItemCount = Math.min(8, validItemCount); // Asegúrate de que visibleItemCount no sea mayor que itemCount

    return (
    <div style={{ width: "100%" }}>
    <List
    height={validHeight * visibleItemCount} // Altura del contenedor (número de opciones visibles)
    itemCount={validItemCount}
    itemSize={validHeight}
    width="100%"
    >
    {({ index, style }) => (
        <div style={{ ...style, width: "100%" }}>{props.children[index]}</div>
    )}
    </List>
    </div>
    );
    };

    const SelectWithVirtualization: React.FC<SelectWithVirtualizationProps> = ({
    options,
    value,
    onChange,
    }) => (
    <Select
    className="react-select-container"
    classNamePrefix="react-select"
    placeholder="Seleccione"
    isClearable
    name="colaborador"
    options={options}
    value={value}
    onChange={onChange}
    components={{ MenuList }}
    styles={{
    menu: (provided) => ({
    ...provided,
    width: '100%',
    }),
    container: (provided) => ({
    ...provided,
    width: '100%',
    }),
}}
/>
);

export default SelectWithVirtualization;
