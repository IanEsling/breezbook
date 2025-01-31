import {
    AddOnId,
    AddOnOrder,
    CouponCode,
    IsoDate, locationId,
    LocationId,
    Price,
    serviceId,
    ServiceId,
    TimeslotSpec
} from '@breezbook/packages-core';

export interface UnpricedBasketLine {
    _type: 'unpriced.basket.line';
    serviceId: ServiceId;
    locationId: LocationId;
    addOnIds: AddOnOrder[];
    date: IsoDate;
    timeslot: TimeslotSpec;
}

export interface UnpricedBasket {
    _type: 'unpriced.basket';
    lines: UnpricedBasketLine[];
    couponCode?: CouponCode;
}

export function unpricedBasket(lines: UnpricedBasketLine[], couponCode?: CouponCode): UnpricedBasket {
    return {
        _type: 'unpriced.basket',
        lines,
        couponCode
    };
}

export function unpricedBasketLine(serviceIdValue: ServiceId | string, locationIdValue: LocationId | string, addOnIds: AddOnOrder[], date: IsoDate, timeslot: TimeslotSpec): UnpricedBasketLine {
    const theServiceId = typeof serviceIdValue === 'string' ? serviceId(serviceIdValue) : serviceIdValue;
    const theLocationId = typeof locationIdValue === 'string' ? locationId(locationIdValue) : locationIdValue;
    return {
        _type: 'unpriced.basket.line',
        serviceId: theServiceId,
        locationId: theLocationId,
        addOnIds,
        date,
        timeslot
    };
}

export interface PricedAddOn {
    addOnId: AddOnId;
    quantity: number;
    price: Price;
}

export interface PricedBasketLine {
    _type: 'priced.basket.line';
    serviceId: ServiceId;
    addOnIds: PricedAddOn[];
    servicePrice: Price;
    total: Price;
}

export interface PricedBasket {
    _type: 'priced.basket';
    lines: PricedBasketLine[];
    couponCode?: CouponCode;
    discount?: Price;
    total: Price;
}

export function pricedBasket(lines: PricedBasketLine[], total: Price, couponCode?: CouponCode, discount?: Price): PricedBasket {
    return {
        _type: 'priced.basket',
        lines,
        couponCode,
        discount,
        total
    };
}

export function pricedBasketLine(serviceIdValue: ServiceId, addOnIds: PricedAddOn[], servicePrice: Price, total: Price): PricedBasketLine {
    return {
        _type: 'priced.basket.line',
        serviceId: serviceIdValue,
        addOnIds,
        total,
        servicePrice
    };
}

export function pricedAddOn(addOnId: AddOnId, quantity: number, price: Price): PricedAddOn {
    return {
        addOnId,
        quantity,
        price
    };
}

export const unpricedBasketFns = {
    getDates(unpricedBasket: UnpricedBasket): { fromDate: IsoDate; toDate: IsoDate } {
        const dates = unpricedBasket.lines.map((l) => l.date);
        const fromDate = dates.reduce((acc, curr) => (acc < curr ? acc : curr));
        const toDate = dates.reduce((acc, curr) => (acc > curr ? acc : curr));
        return {fromDate, toDate};
    }
};
