import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/loader";
import {useParams} from 'react-router-dom';
import {useMessage} from "../../hooks/message.hook";
import $ from 'jquery'; 

export const ProductDetailPage = () => {
    const message = useMessage();
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const {request} = useHttp();
    const productId = useParams().id;
    let productData = [];
    const [quantity, setQuantity] = useState('1');
    const [variant, setVariant] = useState([]);
    
    const loadMessage = async () => {
        try {
            const response = await request(`/product/${productId}`, 'GET')
            console.log('response', response.productPDP.product);
           
            productData.push(response.productPDP.product);
            setData(productData);
            
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
            <p className="center">Product with given id was not found </p>
        )
    }
    const handleChangeSelect = event => {
        // console.log('event.target', event.target);

        // console.log('option_id', event.target.option_id)
        setVariant([ ...variant, {[event.target.name]: event.target.value}]);
        console.log('variant', variant);
    }

    const handleChange = event => {
        setQuantity(event.target.value);
        // console.log('value is:', event.target.value);
    };
    const handleClick = async event => {
        event.preventDefault();
        // console.log("$('.variant_product')", $('.variant_product > .variant_item'));
        if($('.variant_product > .variant_item').length !== variant.length) {
            message(`Please select a product option`);
            return;
        }
        if(0 >= quantity) {
            message(`Please enter quantity greater than zero`);
            return;
        }
        if(data[0]?.inventory?.aggregated?.availableToSell < quantity) {
            message(`Available quantity for purchase: ${data[0].inventory.aggregated.availableToSell}`);
            return;
        }
        // value of input field
        // console.log('handleClick', quantity);
        console.log('variant', variant);
        
        message(`Product added to cart`);
        const response = await request(`/carts`, 'POST', {
            productId: productId,
            quantity: quantity,
            variant: variant
        })
            
        // console.log('response', response);
           
    };

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
                                        <div key={index} className='variant_item'>
                                            {i.node.displayName}
                                            <select onChange={handleChangeSelect} name={i.node.entityId} className='selected_item'>
                                                <option key='default'>
                                                    Select an option
                                                </option>
                                                {i.node.values.edges.map((el, index)=>{
                                                    return (
                                                        <option value={el.node.entityId} key={index}>
                                                            {el.node.label}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    )
                                })}
                            </div>
                            <div>
                                Quantity: 
                                <input 
                                    id='quantity'
                                    onChange={handleChange} 
                                    type="number" 
                                    min="1" 
                                    defaultValue="1"
                                    max='10'/>
                                <button  
                                    onClick={handleClick}
                                    className="btn_margin btn waves-effect waves-light"
                                    >
                                    Add to cart
                                </button>  
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