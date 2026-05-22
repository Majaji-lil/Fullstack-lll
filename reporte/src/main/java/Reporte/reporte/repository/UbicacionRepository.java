package Reporte.reporte.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Reporte.reporte.model.UbicacionModel;

@Repository
public interface UbicacionRepository extends JpaRepository<UbicacionModel, Long> {
}
