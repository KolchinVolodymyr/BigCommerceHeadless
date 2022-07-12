import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/loader";
import {useParams} from 'react-router-dom';

export const ProductDetailPage = () => {
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const {request} = useHttp();
    const productId = useParams().id;
    let productData = [];
    const loadMessage = async () => {
        try {
            const response = await request(`/product/${productId}`, 'GET')
            console.log('response', response.productPDP.product);
           
            productData.push(response.productPDP.product);
            setData(productData);

            console.log('productData', productData);
            
            setIsLoaded(true);
        } catch (e) {console.log(e)}
    };

    // Note: an empty array of dependencies [] means that
    // this useEffect will run once
    // similar to componentDidMount ()
    useEffect(()=> {
        loadMessage();
    }, [])


    if (!isLoaded) {
        return <Loader/>
    }
    if (!data[0]) {
        return (
            <p className="center">No client yet !!! </p>
        )
    }

    console.log('data', data)
    return(
        <div>
            <div className="row">
                {data.map(item => {
                return(
                    <div key={item.id[0]}>
                        <div className="col s6 m6">
                            <div className='img_block'>
                                <img src={item.defaultImage.url640wide} />
                            </div>
                        </div>
                        <div className="col s6 m6">
                            <div className='title'>
                                <h4>{item.name}</h4>
                            </div>
                            {item.prices.salePrice === null 
                                ? <div className='font_price'>
                                    <div>Price: {item.prices.price.value} {item.prices.price.currencyCode}</div>
                                </div>
                                : <div className='font_price'>
                                    <div>Old Price: {item.prices.retailPrice.value} {item.prices.retailPrice.currencyCode}</div>
                                    <div>
                                        NEW Price: {item.prices.salePrice.value} {item.prices.salePrice.currencyCode}
                                    </div>
                                </div>
                             }
                            <div className='sku'>
                                SKU: {item.sku} 
                            </div>
                            <div className='variant_product'>
                                {item.options.edges.map((i, index)=>{
                                    return(
                                        <div key={index}>
                                            {i.node.displayName}
                                            <select className='selected_item'>
                                                {i.node.values.edges.map((el)=>{
                                                    return (
                                                        <option>
                                                            {el.node.label}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="col s12 m12">
                            <h6 className='product_desc'>Product description:</h6>
                            <p>
                                {item.description.replace(/<\/?[a-zA-Z]+>/gi,'')}
                            </p>
                        </div>
                    </div>)
                })}
            </div>
        </div>
    )
}