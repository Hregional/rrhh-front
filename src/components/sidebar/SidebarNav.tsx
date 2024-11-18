import React from "react";

import SidebarNavSection from "./SidebarNavSection";
import { SidebarItemsType } from "../../types/sidebar";
import useAuth from "../../hooks/useAuth";

interface SidebarNavProps {
  items: {
    title: string;
    pages: SidebarItemsType[];
  }[];
}

const SidebarNav = ({ items }: SidebarNavProps) => {
  const { roles } = useAuth();
  if (!roles || roles.length === 0 ) {
    return null; // O puedes devolver un mensaje indicando que no hay roles disponibles
  }
  const hasPermission = (element: SidebarItemsType) => {
    return roles.includes(element.rol ?? '');
  };
  const filteredItems = items.map((item) => {
    const filteredPages = item.pages
      .map((page) => {
        let filteredChildren = [];
  
        // Si la página no tiene hijos o los hijos están vacíos
        if (!page.children || page.children.length === 0) {
          // Verificar si la página tiene permiso directamente
          return hasPermission(page) ? page : null;
        } else {
          // Si la página tiene hijos, filtrar los hijos y verificar el permiso de la página
          filteredChildren = page.children
            .map((child) => {
              if (!child.children) {
                // Si el hijo no tiene hijos, devolver el hijo tal cual
                return child;
              }
  
              // Verificar el número de niveles de los hijos del hijo
              const hasMultipleLevels = child.children.some(grandChild => {
                // Calcular el número de niveles en la URL
                const levelCount = grandChild.href.split('/').length - 1;
                return levelCount >= 3; // Verificar si hay al menos 3 niveles
              });
  
              // Filtrar solo si el hijo tiene hijos con el número deseado de niveles y verificar permisos
              const filteredGrandChildren = hasMultipleLevels
                ? child.children.filter(grandChild => {
                    // Calcular el número de niveles en la URL
                    const levelCount = grandChild.href.split('/').length - 1;
                    return levelCount >= 3 && hasPermission(grandChild);
                  })
                : [];
  
              // Devolver el hijo con los nietos filtrados
              return {
                ...child,
                children: filteredGrandChildren,
              };
            })
            // Filtrar hijos para incluir solo aquellos que tienen permiso
            // o aquellos que tienen hijos con permiso o hijos que cumplen los criterios
            .filter((child) => hasPermission(child) || (child.children && child.children.length > 0));
        }
  
        // Devolver la página con los hijos filtrados, o 'null' si no hay hijos que cumplan los criterios
        return filteredChildren.length > 0 ? { ...page, children: filteredChildren } : null;
      })
      // Filtrar páginas para excluir aquellas que son 'null'
      .filter((page) => page !== null) as SidebarItemsType[]; // Agregar conversión de tipo
  
    // Devolver el item con las páginas filtradas
    return {
      ...item,
      pages: filteredPages,
    };
  })
  // Filtrar items para excluir aquellos que no tienen páginas
  .filter((item) => item.pages.length > 0);
  return (
    <ul className="sidebar-nav">
      {filteredItems.map((item, index) => (
        <SidebarNavSection
          key={index}
          title={item.title}
          pages={item.pages}
        />
      ))}
    </ul>
    // <ul className="sidebar-nav">
    //   {items &&
    //     items.map((item) => (
    //       <SidebarNavSection
    //         key={item.title}
    //         pages={item.pages}
    //         title={item.title}
    //       />
    //     ))}
    // </ul>
  );
};

export default SidebarNav;
