//
//  ListHealthReviewViewController.m
//  TelehealthNotf
//
//  Created by Hung Cao Thanh on 3/10/15.
//  Copyright (c) 2015 HungCao. All rights reserved.
//

#import "ListHealthReviewViewController.h"
#import "SBJson.h"
#import "MBProgressHUD.h"
#import "rteleWebserviceManager.h"
#import "HealthReviewViewController.h"
#import "rteleAppDelegate.h"

@interface ListHealthReviewViewController (){
    NSMutableArray *items;
    NSInteger currentItem;
    
    UIButton *currentButtonClick;
}

@end
@implementation ListHealthReviewViewController

-(void)viewDidLoad{
    [super viewDidLoad];
    [self.tableView setTableFooterView:[[UIView alloc] initWithFrame:CGRectZero]];
    [[NSUserDefaults standardUserDefaults] setValue:@"1" forKey:@"isLoadListHealth"];
    items = [[NSMutableArray alloc] init];
}
-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    currentItem = 0;
    [self loadMoreInfo:0];
//    //Load information from server
//    [MBProgressHUD showHUDAddedTo:self.view animated:YES];
//    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
//    dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
//        //Get doctor ID
//        if ([[[NSUserDefaults standardUserDefaults] valueForKey:@"isLoadListHealth"] isEqualToString:@"1"]) {
//            NSString *returnVal = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/getHealthReviewWithPaging/99999/20/%i",currentItem] jsonData:YES];
//            currentItem = 20;
//            SBJsonParser *jsonParser = [[SBJsonParser alloc] init];
//            NSDictionary *arr = [jsonParser objectWithString:returnVal];
//            if (!items) {
//                [items removeAllObjects];
//            }
//            for (NSDictionary *dataString in arr) {
//                //                NSString *stringData = [dataString objectForKey:@"jsondata"];
//                //                if (stringData) {
//                NSDictionary *dictData = [jsonParser objectWithString:[dataString valueForKey:@"jsondata"]];//[jsonParser objectWithString:stringData];
//                if (dictData) {
//                    [items addObject:dictData];
//                }
//                
//                
//                dictData = nil;
//                //                }
//            }
//            
//            if (items.count > 0) {
//                [self.tableView reloadData];
//            }
//            [[NSUserDefaults standardUserDefaults] setValue:@"0" forKey:@"isLoadListHealth"];
//        }
//        // Do something...
//        [MBProgressHUD hideHUDForView:self.view animated:YES];
//    });
//
//    //end
}
#pragma mark - UITableViewDatasource
-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    return 1;
}
-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return items.count;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    static NSString *identifierString = @"CellIdentifier";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:identifierString];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:identifierString];
        [cell setSelectionStyle:UITableViewCellSelectionStyleNone];
    }
    
    NSDictionary *dictDAta = [items objectAtIndex:indexPath.row];
    NSString *assisstantValue = [dictDAta valueForKey:@"assisstantData"];
    if (!assisstantValue || assisstantValue.length == 0) {
        assisstantValue = @"None Assisstant";
    }
    NSString *stringTitle = [NSString stringWithFormat:@"%@( %@ )",[dictDAta valueForKey:@"dateData"],assisstantValue];
    [cell.textLabel setText:stringTitle];
    
    [cell.detailTextLabel setText:[dictDAta valueForKey:@"timeData"]];
    
    if ([[dictDAta valueForKey:@"isInvoiced"] integerValue] != 0) {
        [cell setAccessoryView:nil];
        [cell.imageView setImage:[UIImage imageNamed:@"check"]];
    }else{
        [cell.imageView setImage:[UIImage imageNamed:@"new.png"]];
        UIButton *invoicedButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
        [invoicedButton setFrame:CGRectMake(0, 0, 80, 30)];
        [invoicedButton setTitle:@"Invoice" forState:UIControlStateNormal];
        [invoicedButton addTarget:self action:@selector(invoicedButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
        [invoicedButton setTag:indexPath.row];
        [cell setAccessoryView:invoicedButton];
    }

    
    
    if (indexPath.row == currentItem - 1) {
        [self loadMoreInfo:currentItem];
    }
    return cell;
}

#pragma mark - UITableViewDelegate
-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    HealthReviewViewController *healthReviewViewController = [[HealthReviewViewController alloc] init];
    [healthReviewViewController dataForView:[items objectAtIndex:indexPath.row]];
    [self.navigationController pushViewController:healthReviewViewController animated:YES];
}

-(void) loadMoreInfo:(NSInteger) index{
    //Load information from server
    [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
    dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
        //Get doctor ID
        if ([[[NSUserDefaults standardUserDefaults] valueForKey:@"isLoadListHealth"] isEqualToString:@"1"]) {
            NSString *returnVal = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/getHealthReviewWithPaging/99999/20/%i",currentItem] jsonData:YES];
            currentItem = 20 + index;
            SBJsonParser *jsonParser = [[SBJsonParser alloc] init];
            NSDictionary *arr = [jsonParser objectWithString:returnVal];
            if (!items) {
                [items removeAllObjects];
            }
            for (NSDictionary *dataString in arr) {
                //                NSString *stringData = [dataString objectForKey:@"jsondata"];
                //                if (stringData) {
                NSMutableDictionary *dictData = [jsonParser objectWithString:[dataString valueForKey:@"jsondata"]];//[jsonParser objectWithString:stringData];
                [dictData setValue:[dataString valueForKey:@"isInvoiced"] forKey:@"isInvoiced"];
                [dictData setValue:[dataString valueForKey:@"id"] forKey:@"id"];
                if (dictData) {
                    [items addObject:dictData];
                }
                
                
                dictData = nil;
                //                }
            }
            
            if (items.count > 0) {
                [self.tableView reloadData];
            }
            [[NSUserDefaults standardUserDefaults] setValue:@"0" forKey:@"isLoadListHealth"];
        }
        // Do something...
        [MBProgressHUD hideHUDForView:self.view animated:YES];
    });
    
    //end
}

-(void) updateDeffered{
    NSDictionary *dict = [items objectAtIndex:currentButtonClick.tag];
    //
//    NSString *post = [NSString stringWithFormat:@"isInvoiced=1&id=%@",[dict valueForKey:@"id"]];
    
    NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/updateInvoiced/?id=%@&token=%@",[dict valueForKey:@"id"],[[NSUserDefaults standardUserDefaults] valueForKey:@"tokenUser"]] postData:nil showAlert:YES];
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    
    if ([retval isEqualToString:@"1"]){
        //        [[[UIAlertView alloc] initWithTitle:nil message:@"Updated successful!." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
    }else{
        //        [[[UIAlertView alloc] initWithTitle:@"Failed!" message:@"Failed to update.\nPlease try it again." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
        [currentButtonClick setTitle:@"Invoice" forState:UIControlStateNormal];
        NSIndexPath *indexPath = [NSIndexPath indexPathForItem:currentButtonClick.tag inSection:0];
        UITableViewCell *cell = [self.tableView cellForRowAtIndexPath:indexPath];
        [cell.imageView setImage:[UIImage imageNamed:@"new"]];
        
    }
}

-(void) invoicedButtonClicked:(UIButton *) button{
    
    [button setTitle:@"Invoiced" forState:UIControlStateNormal];
    NSIndexPath *indexPath = [NSIndexPath indexPathForItem:button.tag inSection:0];
    UITableViewCell *cell = [self.tableView cellForRowAtIndexPath:indexPath];
    [cell.imageView setImage:[UIImage imageNamed:@"check"]];
    currentButtonClick = button;
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
    [self performSelector:@selector(updateDeffered) withObject:nil afterDelay:0.5];
    
    
}

@end
