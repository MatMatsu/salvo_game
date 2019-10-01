package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
public class ShipType {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @OneToOne(mappedBy = "nave",fetch = FetchType.EAGER)
    private Ship ship;

    private int cant;
    private int largo;
    private String type;

    public ShipType() {}

    public ShipType(String newType, int newCant, int newLargo) {
        type = newType;
        cant = newCant;
        largo = newLargo;
    }

    public long getId() { return id; }

    public int getCant() { return cant; }

    public int getLargo() { return largo; }

    public String getType() { return type; }

    public Ship getShip() { return ship; }
}
