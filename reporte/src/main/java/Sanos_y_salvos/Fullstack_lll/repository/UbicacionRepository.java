package Sanos_y_salvos.Fullstack_lll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Sanos_y_salvos.Fullstack_lll.model.UbicacionModel;

@Repository
public interface UbicacionRepository extends JpaRepository<UbicacionModel, Long> {
}
