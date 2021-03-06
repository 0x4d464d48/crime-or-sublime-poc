/**
 * @author Michael Mitchell-Halter
 */

import { Component, OnInit } from "@angular/core";
import { LocatorService } from "./locator.service";

@Component({
    providers: [LocatorService],
    selector: "cos-locator",
    styleUrls: ["./locator.component.css"],
    templateUrl: "./locator.component.html",
})

export class LocatorComponent implements OnInit {
    public getKeys: (object: any) => string[] = Object.keys;
    public graffitiLocations: any = {};

    private MAP_TYPE_ID: google.maps.MapTypeId =
    google.maps.MapTypeId.ROADMAP;

    private DEFAULT_ZOOM: number = 16;

    // Temporary for a prototype. Should replace with users actual location
    private DEFAULT_LAT_LNG: google.maps.LatLng =
    new google.maps.LatLng(49.2827, -123.1207);

    private graffitiMap: google.maps.Map;
    private mapConfiguration: google.maps.MapOptions;
    private graffitiMarker: google.maps.Marker;

    constructor(private locatorService: LocatorService) {
        this.locatorService.filterGraffiti().subscribe((response: any) => {
            response.map((graffiti: any) => {
                const latLng = new google.maps.LatLng(graffiti.latitude, graffiti.longitude);
                this.graffitiLocations[graffiti.url] = latLng;
            });
        });
    }

    /**
     * @desc - Center map to graffiti selected by user and creates a marker.
     *
     * @param url - The URL of the graffiti to center on.
     */
    public showGraffitiLocation(url: string): void {
        const graffitiLatLng = this.graffitiLocations[url];

        // Remove current marker from map
        this.graffitiMarker.setMap(null);

        // Set center and add marker
        this.graffitiMap.setCenter(graffitiLatLng);
        this.graffitiMarker = new google.maps.Marker(
            {
                map: this.graffitiMap,
                position: graffitiLatLng,
                title: "VICTORY",
            });
    }

    public ngOnInit(): void {
        this.initializeMap();
    }

    private initializeMap(): void {
        this.mapConfiguration = {
            center: this.DEFAULT_LAT_LNG,
            mapTypeId: this.MAP_TYPE_ID,
            zoom: this.DEFAULT_ZOOM,
        };

        this.graffitiMap = new google.maps.Map(
            document.getElementById("cos-map"),
            this.mapConfiguration);

        this.graffitiMarker = new google.maps.Marker(
            {
                map: this.graffitiMap,
                position: this.DEFAULT_LAT_LNG,
                title: "TESTING",
            });
    }

}
